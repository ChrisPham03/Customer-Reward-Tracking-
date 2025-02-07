const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../../src/utils/password.utils');

const prisma = new PrismaClient();

/**
 * Create test user with profile
 */
const createTestUser = async (userData = {}) => {
  const defaultData = {
    email: 'test@example.com',
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+1234567890'
  };

  const data = { ...defaultData, ...userData };
  const hashedPassword = await hashPassword(data.password);

  const userAccount = await prisma.userAccount.create({
    data: {
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      isEmailVerified: true
    }
  });

  const userProfile = await prisma.userProfile.create({
    data: {
      userAccountId: userAccount.id,
      firstName: data.firstName,
      lastName: data.lastName
    }
  });

  return { userAccount, userProfile };
};

/**
 * Create test business
 */
const createTestBusiness = async (businessData = {}) => {
  const defaultData = {
    name: 'Test Spa',
    description: 'Test spa description',
    address: '123 Test St',
    category: 'spa'
  };

  const data = { ...defaultData, ...businessData };

  return await prisma.business.create({
    data
  });
};

/**
 * Create test service
 */
const createTestService = async (businessId, serviceData = {}) => {
  const defaultData = {
    name: 'Test Service',
    description: 'Test service description',
    price: 100,
    pointsEarned: 10,
    duration: 60
  };

  const data = { ...defaultData, ...serviceData };

  return await prisma.service.create({
    data: {
      ...data,
      businessId
    }
  });
};

/**
 * Generate auth tokens for test user
 */
const generateTestTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Clean up test data
 */
const cleanupTestData = async () => {
  const tables = [
    'Point',
    'QRTransaction',
    'ServiceBooking',
    'Service',
    'Business',
    'UserProfile',
    'UserAccount'
  ];

  for (const table of tables) {
    await prisma[table].deleteMany();
  }
};

module.exports = {
  createTestUser,
  createTestBusiness,
  createTestService,
  generateTestTokens,
  cleanupTestData,
  prisma
};