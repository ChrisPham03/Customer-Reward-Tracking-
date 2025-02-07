const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const pointsService = require('./points.service');

const prisma = new PrismaClient();

class QRTransactionService {
  /**
   * Generate QR code for transaction
   * @param {Object} data - Transaction data
   * @returns {Promise<Object>} QR transaction object
   */
  async generateQRTransaction(data) {
    const { userProfileId, points, type } = data;
    
    // Generate unique QR code
    const qrCode = this.generateUniqueCode();
    
    // Default expiry time (15 minutes)
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    // Create QR transaction record
    return await prisma.qRTransaction.create({
      data: {
        userProfileId,
        qrCode,
        type,          // 'earn' or 'redeem'
        points,
        status: 'pending',
        expiryDate
      }
    });
  }

  /**
   * Process QR transaction
   * @param {string} qrCode - QR code to process
   * @param {string} businessId - Business ID processing the transaction
   * @returns {Promise<Object>} Processed transaction
   */
  async processQRTransaction(qrCode, businessId) {
    // Use transaction to ensure data consistency
    return await prisma.$transaction(async (prisma) => {
      // Get and validate QR transaction
      const qrTransaction = await prisma.qRTransaction.findUnique({
        where: { qrCode },
        include: { userProfile: true }
      });

      // Validate transaction
      this.validateTransaction(qrTransaction);

      // Process based on transaction type
      if (qrTransaction.type === 'earn') {
        await pointsService.addPoints({
          userProfileId: qrTransaction.userProfileId,
          businessId,
          amount: qrTransaction.points,
          source: 'qr_code',
          description: `Points earned via QR code: ${qrCode}`
        });
      } else if (qrTransaction.type === 'redeem') {
        await pointsService.deductPoints({
          userProfileId: qrTransaction.userProfileId,
          businessId,
          amount: qrTransaction.points,
          source: 'qr_code',
          description: `Points redeemed via QR code: ${qrCode}`
        });
      }

      // Update transaction status
      return await prisma.qRTransaction.update({
        where: { id: qrTransaction.id },
        data: { status: 'completed' }
      });
    });
  }

  /**
   * Validate QR transaction
   * @param {Object} transaction - Transaction to validate
   */
  validateTransaction(transaction) {
    if (!transaction) {
      throw new Error('Invalid QR code');
    }

    if (transaction.status !== 'pending') {
      throw new Error('QR code has already been used');
    }

    if (transaction.expiryDate < new Date()) {
      throw new Error('QR code has expired');
    }
  }

  /**
   * Generate unique QR code
   * @returns {string} Unique QR code
   */
  generateUniqueCode() {
    // Generate 32 random bytes and convert to hex
    const randomBytes = crypto.randomBytes(16).toString('hex');
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    return `${timestamp}-${randomBytes}`;
  }

  /**
   * Get transaction status
   * @param {string} qrCode - QR code to check
   * @returns {Promise<Object>} Transaction status
   */
  async getTransactionStatus(qrCode) {
    return await prisma.qRTransaction.findUnique({
      where: { qrCode },
      include: {
        userProfile: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  /**
   * Get user's transaction history
   * @param {string} userProfileId - User profile ID
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactionHistory(userProfileId) {
    return await prisma.qRTransaction.findMany({
      where: { userProfileId },
      orderBy: { createdAt: 'desc' },
      include: {
        userProfile: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  /**
   * Cancel pending transaction
   * @param {string} qrCode - QR code to cancel
   * @returns {Promise<Object>} Cancelled transaction
   */
  async cancelTransaction(qrCode) {
    const transaction = await prisma.qRTransaction.findUnique({
      where: { qrCode }
    });

    if (!transaction || transaction.status !== 'pending') {
      throw new Error('Transaction cannot be cancelled');
    }

    return await prisma.qRTransaction.update({
      where: { qrCode },
      data: { status: 'cancelled' }
    });
  }
}

module.exports = new QRTransactionService();