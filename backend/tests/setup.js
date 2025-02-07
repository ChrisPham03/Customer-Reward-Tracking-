const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up all tables after each test
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
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});