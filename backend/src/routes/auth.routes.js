// Import the express module
const express = require('express');

// Import the body function from express-validator to validate request bodies
const { body } = require('express-validator');

// Import custom middleware to validate requests
const { validateRequest } = require('../middleware/validate.middleware');

// Import custom middleware to authenticate requests
const { authenticate } = require('../middleware/auth.middleware');

// Import controller functions for authentication
const {
  register, // Function to handle user registration
  login,    // Function to handle user login
  refresh,  // Function to handle token refresh
  logout    // Function to handle user logout
} = require('../controllers/auth.controller');

// Create a new router object
const router = express.Router();

// Registration validation rules
/**
 * Validation middleware for user registration
 * @constant {Array} registerValidation
 * @description Array of validation rules for user registration using express-validator
 * - Validates email format and normalizes it
 * - Ensures password is at least 8 characters
 * - Requires non-empty first name
 * - Requires non-empty last name
 * - Optionally validates phone number format using E.164 standard
 * @example
 * router.post('/register', registerValidation, registerController);
 */
const registerValidation = [
  // Validate email format and normalize it
  body('email')
    .isEmail() // Check if the email is valid
    .normalizeEmail() // Normalize the email address
    .withMessage('Valid email is required'), // Custom error message if validation fails
  
  // Ensure password is at least 8 characters long
  body('password')
    .isLength({ min: 8 }) // Check if the password is at least 8 characters long
    .withMessage('Password must be at least 8 characters long'), // Custom error message if validation fails
  
  // Require non-empty first name
  body('firstName')
    .trim() // Remove whitespace from both ends of the first name
    .notEmpty() // Check if the first name is not empty
    .withMessage('First name is required'), // Custom error message if validation fails
  
  // Require non-empty last name
  body('lastName')
    .trim() // Remove whitespace from both ends of the last name
    .notEmpty() // Check if the last name is not empty
    .withMessage('Last name is required'), // Custom error message if validation fails
  
  // Optionally validate phone number format using E.164 standard
  body('phoneNumber')
    .optional() // Make the phone number optional
    .matches(/^\+?[1-9]\d{1,14}$/) // Check if the phone number matches the E.164 format
    .withMessage('Invalid phone number format') // Custom error message if validation fails
];

// Login validation rules
const loginValidation = [
  // Validate email format and normalize it
  body('email')
    .isEmail() // Check if the email is valid
    .normalizeEmail() // Normalize the email address
    .withMessage('Valid email is required'), // Custom error message if validation fails
  
  // Ensure password is not empty
  body('password')
    .notEmpty() // Check if the password is not empty
    .withMessage('Password is required') // Custom error message if validation fails
];

// Refresh token validation rules
const refreshValidation = [
  // Ensure refresh token is not empty
  body('refreshToken')
    .notEmpty() // Check if the refresh token is not empty
    .withMessage('Refresh token is required') // Custom error message if validation fails
];

// Define the registration route with validation and controller
router.post('/register', registerValidation, validateRequest, register);

// Define the login route with validation and controller
router.post('/login', loginValidation, validateRequest, login);

// Define the refresh token route with validation and controller
router.post('/refresh', refreshValidation, validateRequest, refresh);

// Define the logout route with authentication and controller
router.post('/logout', authenticate, logout);

// Optional: Get current user route
router.get('/me', authenticate, async (req, res) => {
  try {
    // Respond with the current user information
    return res.json({
      status: 'success',
      data: { user: req.user }
    });
  } catch (error) {
    // Handle errors and respond with a 500 status
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user information'
    });
  }
});

// Export the router object
module.exports = router;