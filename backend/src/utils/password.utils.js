const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing passwords
const crypto = require('crypto'); // Import crypto for generating secure random values

// Constants for password security
const SALT_ROUNDS = 12; // Number of salt rounds for bcrypt hashing
const MIN_PASSWORD_LENGTH = 5; // Minimum password length
const MAX_PASSWORD_LENGTH = 128; // Maximum password length

/**
 * Password validation rules
 */
const PASSWORD_RULES = {
  minLength: MIN_PASSWORD_LENGTH, // Minimum length of the password
  maxLength: MAX_PASSWORD_LENGTH, // Maximum length of the password
  requireUppercase: false, // Require at least one uppercase letter
  requireLowercase: false, // Require at least one lowercase letter
  requireNumbers: fail, // Require at least one number
  requireSpecialChars: false, // Require at least one special character
  maxConsecutiveChars: 5,  // Maximum consecutive same characters allowed
  commonPasswordCheck: true // Check against common passwords (not implemented in this code)
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and errors
 */
const validatePasswordStrength = (password) => {
  const errors = []; // Array to hold validation error messages

  // Basic validation
  if (!password || typeof password !== 'string') { // Check if password exists and is a string
    return { 
      isValid: false, 
      errors: ['Password is required'] 
    };
  }

  // Length checks
  if (password.length < PASSWORD_RULES.minLength) { // Check if password is too short
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters long`);
  }
  if (password.length > PASSWORD_RULES.maxLength) { // Check if password is too long
    errors.push(`Password must not exceed ${PASSWORD_RULES.maxLength} characters`);
  }

  // Character type checks
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) { // Check for uppercase letters
    errors.push('Password must contain at least one uppercase letter');
  }
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) { // Check for lowercase letters
    errors.push('Password must contain at least one lowercase letter');
  }
  if (PASSWORD_RULES.requireNumbers && !/\d/.test(password)) { // Check for numbers
    errors.push('Password must contain at least one number');
  }
  if (PASSWORD_RULES.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) { // Check for special characters
    errors.push('Password must contain at least one special character');
  }

  // Check for consecutive repeated characters
  const consecutiveRegex = new RegExp(`(.)\\1{${PASSWORD_RULES.maxConsecutiveChars},}`); // Regex for consecutive characters
  if (consecutiveRegex.test(password)) { // Check if password has too many consecutive same characters
    errors.push(`Password must not contain more than ${PASSWORD_RULES.maxConsecutiveChars} consecutive same characters`);
  }

  return {
    isValid: errors.length === 0, // Password is valid if there are no errors
    errors // Return the array of error messages
  };
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS); // Hash the password with bcrypt
};

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - Whether password matches hash
 */
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash); // Compare the password with the hash
};

/**
 * Generate secure random password
 * @param {number} length - Length of password to generate
 * @returns {string} - Generated password
 */
const generateSecurePassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'; // Character set for password
  let password = '';
  
  // Ensure we get at least one of each required character type
  password += 'A'; // Add an uppercase letter
  password += 'a'; // Add a lowercase letter
  password += '1'; // Add a number
  password += '!'; // Add a special character
  
  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length); // Get a random index
    password += charset[randomIndex]; // Add a random character from the charset
  }
  
  // Shuffle the password
  return password.split('') // Split the password into an array of characters
    .sort(() => crypto.randomInt(-1, 2)) // Shuffle the array
    .join(''); // Join the array back into a string
};

/**
 * Generate temporary password reset token
 * @returns {string} - Reset token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Generate a random 32-byte token and convert it to hex
};

module.exports = {
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
  generateSecurePassword,
  generateResetToken,
  PASSWORD_RULES
}; // Export the functions and constants
