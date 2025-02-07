const { PrismaClient } = require('@prisma/client'); // Import PrismaClient from the Prisma package
const { hashPassword, verifyPassword, validatePasswordStrength } = require('../utils/password.utils'); // Import utility functions for password handling
const { generateTokens, verifyToken, refreshAccessToken } = require('../utils/jwt.utils'); // Import utility functions for JWT handling

const prisma = new PrismaClient(); // Instantiate a new PrismaClient

/**
 * User registration controller
 */
/**
 * Handles user registration by creating a new user account and profile.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user registration data
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {string} req.body.firstName - User's first name
 * @param {string} req.body.lastName - User's last name
 * @param {string} req.body.phoneNumber - User's phone number
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing:
 *                           - status: 'success' or 'error'
 *                           - message: Description of the operation result
 *                           - data: User information and authentication tokens (on success)
 * @throws {Error} When database operations fail or validation errors occur
 */
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body; // Destructure user registration data from the request body

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password); // Validate the strength of the provided password
    if (!passwordValidation.isValid) { // If the password is not valid
      return res.status(400).json({ // Return a 400 Bad Request response
        status: 'error',
        message: 'Invalid password',
        errors: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await prisma.userAccount.findFirst({ // Check if a user with the same email or phone number already exists
      where: {
        OR: [
          { email },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) { // If a user already exists
      return res.status(400).json({ // Return a 400 Bad Request response
        status: 'error',
        message: 'User already exists with this email or phone number'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password); // Hash the user's password

    // Create user account and profile in a transaction
    const result = await prisma.$transaction(async (prisma) => { // Use a transaction to create the user account and profile
      // Create user account
      const userAccount = await prisma.userAccount.create({ // Create a new user account
        data: {
          email,
          phoneNumber,
          password: hashedPassword
        }
      });

      // Create user profile
      const userProfile = await prisma.userProfile.create({ // Create a new user profile linked to the user account
        data: {
          userAccountId: userAccount.id,
          firstName,
          lastName
        }
      });

      return { userAccount, userProfile }; // Return the created user account and profile
    });

    // Generate tokens
    const tokens = generateTokens({ // Generate authentication tokens for the user
      id: result.userAccount.id,
      email: result.userAccount.email
    });

    return res.status(201).json({ // Return a 201 Created response with the user data and tokens
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: result.userAccount.id,
          email: result.userAccount.email,
          firstName: result.userProfile.firstName,
          lastName: result.userProfile.lastName
        },
        tokens
      }
    });

  } catch (error) { // Catch any errors that occur during the process
    console.error('Registration error:', error); // Log the error to the console
    return res.status(500).json({ // Return a 500 Internal Server Error response
      status: 'error',
      message: 'Failed to register user'
    });
  }
};