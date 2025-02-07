// Import required dependencies
const express = require('express');                // Import Express.js framework
const cors = require('cors');                      // Import CORS middleware for cross-origin requests
const { PrismaClient } = require('@prisma/client'); // Import Prisma ORM client
const authRoutes = require('./routes/auth.routes'); // Import authentication routes
const pointsRoutes = require('./routes/points.routes');
const qrRoutes = require('./routes/qr.routes');
// Create Express application and initialize Prisma
const app = express();                            // Create new Express application instance
const prisma = new PrismaClient();                // Create new Prisma client instance
const PORT = process.env.PORT || 3000;            // Set port from environment variables or default to 3000

// Set up middleware
app.use(cors());                                  // Enable CORS for all routes
app.use(express.json());                          // Parse JSON bodies in requests
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies with nested objects

// Register routes
app.use('/api/auth', authRoutes);                // Mount authentication routes under /api/auth path

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);                       // Log error stack trace
  res.status(500).json({                         // Send 500 status with error response
    status: 'error',
    message: 'Something went wrong!',
    // Only include error message in development environment
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use('/api/points', pointsRoutes);
app.use('/api/qr', qrRoutes);
// Server startup function
const startServer = async () => {
  try {
    await prisma.$connect();                      // Connect to database via Prisma
    console.log('Successfully connected to database');
    
    app.listen(PORT, () => {                      // Start Express server
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {                               // Handle startup errors
    console.error('Failed to start server:', error);
    process.exit(1);                              // Exit process with failure code
  }
};

startServer();                                    // Initialize server