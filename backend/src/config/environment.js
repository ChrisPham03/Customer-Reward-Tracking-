const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Environment configuration object
const env = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Server configuration
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || 'localhost',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET,
    ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE || '15m',
    REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  
  // AWS configuration - commented out for future implementation
  /* 
  AWS: {
    REGION: process.env.AWS_REGION,
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    SNS_TOPIC_ARN: process.env.AWS_SNS_TOPIC_ARN,
    SES_FROM_EMAIL: process.env.AWS_SES_FROM_EMAIL,
  },
  */

  // Validation
  validateEnv() {
    const required = [
      'DATABASE_URL',
      'JWT_SECRET',
      // AWS requirements commented out for now
      /*
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY'
      */
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }
};

// Validate required environment variables
env.validateEnv();

module.exports = env;