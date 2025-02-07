const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const env = require('../config/environment'); // Import environment configuration

/**
 * Generate access token
 * @param {Object} payload - Data to be included in the token
 * @returns {string} - JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT.SECRET, { // Sign the payload with the secret and set expiration
    expiresIn: env.JWT.ACCESS_EXPIRE // Set the expiration time for the access token
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Data to be included in the token
 * @returns {string} - JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'refresh' }, // Add type 'refresh' to the payload
    env.JWT.SECRET, // Sign the payload with the secret
    { expiresIn: env.JWT.REFRESH_EXPIRE } // Set the expiration time for the refresh token
  );
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - Data to be included in the tokens
 * @returns {Object} - Object containing both tokens
 */
const generateTokens = (payload) => {
  // Remove sensitive data from payload
  const tokenPayload = {
    userId: payload.id, // Include user ID
    email: payload.email, // Include email
    roles: payload.roles || [] // Include roles or an empty array if not provided
  };

  return {
    accessToken: generateAccessToken(tokenPayload), // Generate access token
    refreshToken: generateRefreshToken(tokenPayload) // Generate refresh token
  };
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT.SECRET); // Verify the token with the secret
  } catch (error) {
    return null; // Return null if verification fails
  }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Object|null} - New tokens or null if invalid
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT.SECRET); // Verify the refresh token

    // Verify it's a refresh token
    if (decoded.type !== 'refresh') {
      return null; // Return null if it's not a refresh token
    }

    // Remove unnecessary fields and generate new tokens
    const { type, exp, iat, ...payload } = decoded; // Destructure and remove unnecessary fields
    return {
      accessToken: generateAccessToken(payload), // Generate new access token
      refreshToken: generateRefreshToken(payload) // Generate new refresh token
    };
  } catch (error) {
    return null; // Return null if verification fails
  }
};

/**
 * Decode token without verification
 * Useful for debugging or getting payload without verifying signature
 * @param {string} token - Token to decode
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token); // Decode the token without verification
  } catch (error) {
    return null; // Return null if decoding fails
  }
};

module.exports = {
  generateAccessToken, // Export generateAccessToken function
  generateRefreshToken, // Export generateRefreshToken function
  generateTokens, // Export generateTokens function
  verifyToken, // Export verifyToken function
  refreshAccessToken, // Export refreshAccessToken function
  decodeToken // Export decodeToken function
};
