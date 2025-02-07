const request = require('supertest');
const app = require('../src/app');
const {
  createTestUser,
  createTestBusiness,
  generateTestTokens,
  cleanupTestData,
  prisma
} = require('./helpers');

describe('QR Transaction API', () => {
  let user;
  let business;
  let accessToken;
  let qrTransaction;

  beforeEach(async () => {
    await cleanupTestData();

    // Create test user and business
    const userData = await createTestUser();
    user = userData.userProfile;
    business = await createTestBusiness();

    // Generate access token
    const tokens = generateTestTokens(userData.userAccount.id);
    accessToken = tokens.accessToken;
  });

  describe('GET /api/qr/history', () => {
    beforeEach(async () => {
      // Create multiple QR transactions
      await prisma.qRTransaction.createMany({
        data: [
          {
            userProfileId: user.id,
            qrCode: 'test-qr-1',
            type: 'earn',
            points: 100,
            status: 'completed',
            expiryDate: new Date(Date.now() + 1000 * 60 * 15) // 15 minutes from now
          },
          {
            userProfileId: user.id,
            qrCode: 'test-qr-2',
            type: 'redeem',
            points: 50,
            status: 'pending',
            expiryDate: new Date(Date.now() + 1000 * 60 * 15)
          }
        ]
      });
    });

    it('should get transaction history successfully', async () => {
      const response = await request(app)
        .get('/api/qr/history')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array for user with no transactions', async () => {
      // Create new user with no transactions
      const newUserData = await createTestUser({ email: 'new@example.com' });
      const newTokens = generateTestTokens(newUserData.userAccount.id);

      const response = await request(app)
        .get('/api/qr/history')
        .set('Authorization', `Bearer ${newTokens.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('POST /api/qr/cancel/:qrCode', () => {
    beforeEach(async () => {
      // Create a pending QR transaction
      const generated = await prisma.qRTransaction.create({
        data: {
          userProfileId: user.id,
          qrCode: 'test-qr-cancel',
          type: 'earn',
          points: 100,
          status: 'pending',
          expiryDate: new Date(Date.now() + 1000 * 60 * 15)
        }
      });
      qrTransaction = generated;
    });

    it('should cancel pending transaction successfully', async () => {
      const response = await request(app)
        .post(`/api/qr/cancel/${qrTransaction.qrCode}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.status).toBe('cancelled');
    });

    it('should not cancel completed transaction', async () => {
      // Update transaction to completed
      await prisma.qRTransaction.update({
        where: { id: qrTransaction.id },
        data: { status: 'completed' }
      });

      const response = await request(app)
        .post(`/api/qr/cancel/${qrTransaction.qrCode}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('cannot be cancelled');
    });

    it('should not cancel non-existent transaction', async () => {
      const response = await request(app)
        .post('/api/qr/cancel/non-existent-code')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full QR point earning flow', async () => {
      // 1. Generate QR code
      const generateResponse = await request(app)
        .post('/api/qr/generate')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          points: 100,
          type: 'earn'
        });

      expect(generateResponse.status).toBe(200);
      const qrCode = generateResponse.body.data.qrCode;

      // 2. Process QR code
      const processResponse = await request(app)
        .post(`/api/qr/process/${qrCode}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: business.id
        });

      expect(processResponse.status).toBe(200);

      // 3. Check points balance
      const balanceResponse = await request(app)
        .get(`/api/points/balance/${business.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(balanceResponse.status).toBe(200);
      expect(balanceResponse.body.data.balance).toBe(100);
    });

    it('should complete full QR point redemption flow', async () => {
      // 1. Add initial points
      await prisma.point.create({
        data: {
          userProfileId: user.id,
          businessId: business.id,
          amount: 200,
          type: 'earned',
          source: 'test'
        }
      });

      // 2. Generate redemption QR
      const generateResponse = await request(app)
        .post('/api/qr/generate')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          points: 100,
          type: 'redeem'
        });

      expect(generateResponse.status).toBe(200);
      const qrCode = generateResponse.body.data.qrCode;

      // 3. Process redemption
      const processResponse = await request(app)
        .post(`/api/qr/process/${qrCode}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: business.id
        });

      expect(processResponse.status).toBe(200);

      // 4. Check updated balance
      const balanceResponse = await request(app)
        .get(`/api/points/balance/${business.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(balanceResponse.status).toBe(200);
      expect(balanceResponse.body.data.balance).toBe(100);
    });
  });
});