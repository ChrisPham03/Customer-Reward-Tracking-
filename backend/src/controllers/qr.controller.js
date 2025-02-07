const qrService = require('../services/qr.service');

class QRTransactionController {
  /**
   * Generate QR code for transaction
   */
  async generateQR(req, res) {
    try {
      const { points, type } = req.body;
      const userProfileId = req.user.profileId;

      const qrTransaction = await qrService.generateQRTransaction({
        userProfileId,
        points,
        type
      });

      res.status(200).json({
        status: 'success',
        message: 'QR code generated successfully',
        data: qrTransaction
      });
    } catch (error) {
      console.error('Generate QR error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to generate QR code'
      });
    }
  }

  /**
   * Process QR transaction
   */
  async processQR(req, res) {
    try {
      const { qrCode } = req.params;
      const { businessId } = req.body;

      const transaction = await qrService.processQRTransaction(qrCode, businessId);

      res.status(200).json({
        status: 'success',
        message: 'QR transaction processed successfully',
        data: transaction
      });
    } catch (error) {
      console.error('Process QR error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to process QR transaction'
      });
    }
  }

  /**
   * Get transaction status
   */
  async getStatus(req, res) {
    try {
      const { qrCode } = req.params;

      const status = await qrService.getTransactionStatus(qrCode);

      res.status(200).json({
        status: 'success',
        data: status
      });
    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get transaction status'
      });
    }
  }

  /**
   * Get transaction history
   */
  async getHistory(req, res) {
    try {
      const userProfileId = req.user.profileId;

      const history = await qrService.getTransactionHistory(userProfileId);

      res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get transaction history'
      });
    }
  }

  /**
   * Cancel transaction
   */
  async cancelTransaction(req, res) {
    try {
      const { qrCode } = req.params;

      const cancelled = await qrService.cancelTransaction(qrCode);

      res.status(200).json({
        status: 'success',
        message: 'Transaction cancelled successfully',
        data: cancelled
      });
    } catch (error) {
      console.error('Cancel transaction error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to cancel transaction'
      });
    }
  }
}

module.exports = new QRTransactionController();