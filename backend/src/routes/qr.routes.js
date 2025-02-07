const express = require('express');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const qrController = require('../controllers/qr.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation rules
const generateQRValidation = [
  body('points')
    .isInt({ min: 1 })
    .withMessage('Points must be a positive number'),
  body('type')
    .isIn(['earn', 'redeem'])
    .withMessage('Type must be either earn or redeem')
];

const processQRValidation = [
  param('qrCode')
    .notEmpty()
    .withMessage('QR code is required'),
  body('businessId')
    .notEmpty()
    .withMessage('Business ID is required')
];

// Routes
router.post(
  '/generate',
  generateQRValidation,
  validateRequest,
  qrController.generateQR
);

router.post(
  '/process/:qrCode',
  processQRValidation,
  validateRequest,
  qrController.processQR
);

router.get(
  '/status/:qrCode',
  param('qrCode').notEmpty(),
  validateRequest,
  qrController.getStatus
);

router.get(
  '/history',
  qrController.getHistory
);

router.post(
  '/cancel/:qrCode',
  param('qrCode').notEmpty(),
  validateRequest,
  qrController.cancelTransaction
);

module.exports = router;