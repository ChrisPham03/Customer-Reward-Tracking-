const { PrismaClient } = require('@prisma/client');
const env = require('./environment');

class Database {
  constructor() {
    this.prisma = null;
    this.isConnected = false;
  }

  /**
   * Get Prisma client instance
   * @returns {PrismaClient}
   */
  getClient() {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: env.DATABASE_URL
          }
        },
        log: env.NODE_ENV === 'development' 
          ? ['query', 'info', 'warn', 'error']
          : ['error']
      });
    }
    return this.prisma;
  }

  /**
   * Connect to database
   */
  async connect() {
    try {
      const prisma = this.getClient();
      await prisma.$connect();
      this.isConnected = true;
      console.log('Successfully connected to database');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.isConnected = false;
      console.log('Disconnected from database');
    }
  }

  /**
   * Check database connection health
   */
  async healthCheck() {
    try {
      const prisma = this.getClient();
      // Execute a simple query to check connection
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new Database();