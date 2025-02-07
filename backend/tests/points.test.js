const request = require('supertest');
const app = require('../src/app');
const {
  createTestUser,
  createTestBusiness,
  generateTestTokens,
  cleanupTestData,
  prisma
} = require('./helpers');

describe('Points Management API', () => {
  let user;
  let business;
  let accessToken;

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

  describe('POST /api/points/add', () => {
    it('should add points successfully', async () => {
      const pointsData = {
        businessId: business.id,
        amount: 100,
        description: 'Test points addition'
      };

      const response = await request(app)
        .post('/api/points/add')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(pointsData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.amount).toBe(pointsData.amount);
    });

    it('should not add points with invalid business ID', async () => {
      const response = await request(app)
        .post('/api/points/add')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: 'invalid-id',
          amount: 100
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should not add negative points', async () => {
      const response = await request(app)
        .post('/api/points/add')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: business.id,
          amount: -100
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/points/deduct', () => {
    beforeEach(async () => {
      // Add initial points
      await prisma.point.create({
        data: {
          userProfileId: user.id,
          businessId: business.id,
          amount: 200,
          type: 'earned',
          source: 'test'
        }
      });
    });

    it('should deduct points successfully', async () => {
      const response = await request(app)
        .post('/api/points/deduct')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: business.id,
          amount: 100,
          description: 'Test points deduction'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should not deduct more points than available', async () => {
      const response = await request(app)
        .post('/api/points/deduct')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: business.id,
          amount: 300,
          description: 'Test points deduction'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Insufficient points');
    });

    it('should not deduct points with invalid amount', async () => {
      const response = await request(app)
        .post('/api/points/deduct')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessId: business.id,
          amount: 0
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/points/balance/:businessId', () => {
    beforeEach(async () => {
      await prisma.point.createMany({
        data: [
          {
            userProfileId: user.id,
            businessId: business.id,
            amount: 150,
            type: 'earned',
            source: 'test'
          },
          {
            userProfileId: user.id,
            businessId: business.id,
            amount: -50,
            type: 'spent',
            source: 'test'
          }
        ]
      });
    });

    it('should get points balance successfully', async () => {
      const response = await request(app)
        .get(`/api/points/balance/${business.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.balance).toBe(100); // 150 - 50
    });

    it('should return 0 for non-existent business', async () => {
      const response = await request(app)
        .get('/api/points/balance/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.balance).toBe(0);
    });
  });

  describe('GET /api/points/history', () => {
    beforeEach(async () => {
      await prisma.point.createMany({
        data: [
          {
            userProfileId: user.id,
            businessId: business.id,
            amount: 100,
            type: 'earned',
            source: 'test',
            description: 'First transaction'
          },
          {
            userProfileId: user.id,
            businessId: business.id,
            amount: -50,
            type: 'spent',
            source: 'test',
            description: 'Second transaction'
          }
        ]
      });
    });

    it('should get points history successfully', async () => {
      const response = await request(app)
        .get('/api/points/history')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.history).toHaveLength(2);
      expect(response.body.data.history[0].amount).toBe(-50);
      expect(response.body.data.history[1].amount).toBe(100);
    });

    it('should filter history by type', async () => {
      const response = await request(app)
        .get('/api/points/history?type=earned')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.history).toHaveLength(1);
      expect(response.body.data.history[0].amount).toBe(100);
    });

    it('should filter history by business', async () => {
      const response = await request(app)
        .get(`/api/points/history?businessId=${business.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.history).toHaveLength(2);
    });
  });

  describe('GET /api/points/expiring', () => {
    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 20); // 20 days from now

      await prisma.point.createMany({
        data: [
          {
            userProfileId: user.id,
            businessId: business.id,
            amount: 100,
            type: 'earned',
            source: 'test',
            expiryDate: futureDate
          }
        ]
      });
    });

    it('should get expiring points successfully', async () => {
      const response = await request(app)
        .get('/api/points/expiring')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.expiringPoints).toHaveLength(1);
    });

    it('should respect days threshold parameter', async () => {
      const response = await request(app)
        .get('/api/points/expiring?days=10')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.expiringPoints).toHaveLength(0);
    });
  });
});