const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/spa_points_test';

// Global setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Global teardown
afterAll(async () => {
  // Clean up database connections
  await prisma.$disconnect();
});

// Clear database between tests
afterEach(async () => {
  const modelNames = Reflect.ownKeys(prisma).filter(key => key[0] !== '_');
  
  await Promise.all(
    modelNames.map(modelName => 
      prisma[modelName].deleteMany()
    )
  );
});