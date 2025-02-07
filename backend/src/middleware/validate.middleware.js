// Import the validationResult utility from express-validator
// This helps collect and handle validation errors
const { validationResult } = require('express-validator');

/**
 * Middleware function that validates incoming requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Returns 400 status with// Import the validationResult utility from express-validator
// This helps collect and handle validation errors
const { validationResult } = require('express-validator');

/**

const { validationResult } = require('express-validator'); // Import the validationResult function from express-validator

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
const validateRequest = (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);
  
  // If there are validation errors, return a 400 response with error details
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: errors.array().map(err => ({
        field: err.param, // The field that caused the validation error
        message: err.msg  // The validation error message
      }))
    });
  }
  
  // If no validation errors, proceed to the next middleware or route handler
  next();
};

/**
 * Common validation rules
 */
const validationRules = {
  // User registration validation rules
  register: [
    {
      field: 'email', // The field to validate
      rules: {
        notEmpty: true, // The field must not be empty
        isEmail: true,  // The field must be a valid email
        normalizeEmail: true // Normalize the email (e.g., remove dots in Gmail addresses)
      },
      message: 'Valid email is required' // Error message if validation fails
    },
    {
      field: 'password', // The field to validate
      rules: {
        notEmpty: true, // The field must not be empty
        isLength: { min: 8 }, // The field must be at least 8 characters long
        matches: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ // The field must contain at least one uppercase letter, one lowercase letter, and one number
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' // Error message if validation fails
    }
  ],

  // User login validation rules
  login: [
    {
      field: 'email', // The field to validate
      rules: {
        notEmpty: true, // The field must not be empty
        isEmail: true,  // The field must be a valid email
        normalizeEmail: true // Normalize the email (e.g., remove dots in Gmail addresses)
      },
      message: 'Valid email is required' // Error message if validation fails
    },
    {
      field: 'password', // The field to validate
      rules: {
        notEmpty: true // The field must not be empty
      },
      message: 'Password is required' // Error message if validation fails
    }
  ]
};

module.exports = {
  validateRequest, // Export the validateRequest middleware
  validationRules // Export the validation rules
};