const express = require('express');
const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const pointsController = require('../controllers/points.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation rules
const addPointsValidation = [
  body('businessId').notEmpty().withMessage('Business ID is required'),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive number'),
  body('description').optional().isString()
];

const deductPointsValidation = [
  body('businessId').notEmpty().withMessage('Business ID is required'),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive number'),
  body('description').optional().isString()
];

const getBalanceValidation = [
  param('businessId').notEmpty().withMessage('Business ID is required')
];

const getHistoryValidation = [
  query('businessId').optional().isString(),
  query('type').optional().isIn(['earned', 'spent']).withMessage('Invalid type')
];

// Routes
router.post(
  '/add',
  addPointsValidation,
  validateRequest,
  pointsController.addPoints
);

router.post(
  '/deduct',
  deductPointsValidation,
  validateRequest,
  pointsController.deductPoints
);

router.get(
  '/balance/:businessId',
  getBalanceValidation,
  validateRequest,
  pointsController.getBalance
);

router.get(
  '/history',
  getHistoryValidation,
  validateRequest,
  pointsController.getHistory
);

router.get(
  '/expiring',
  pointsController.getExpiringPoints
);

module.exports = router;