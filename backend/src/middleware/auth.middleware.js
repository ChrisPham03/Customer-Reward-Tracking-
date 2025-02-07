const env = require('../config/environment'); // Import environment configuration
const { verifyToken } = require('../utils/jwt.utils'); // Import JWT token verification utility

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header is present
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'No authorization token provided'
      });
    }

    // Split the Authorization header into parts
    const parts = authHeader.split(' ');
    
    // Check if the token format is valid (must be "Bearer [token]")
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format'
      });
    }

    // Extract the token from the Authorization header
    const token = parts[1];

    // Verify the token using the verifyToken utility
    const decoded = verifyToken(token);
    
    // Check if the token is valid and not expired
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Attach decoded user data to the request object
    req.user = decoded;
    
    // Call the next middleware function
    next();
  } catch (error) {
    // Handle any errors that occur during authentication
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

module.exports = {
  authenticate // Export the authenticate middleware function
};
