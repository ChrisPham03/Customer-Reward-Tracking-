const pointsService = require('../services/points.service');

class PointsController {
  /**
   * Add points to user account
   */
  async addPoints(req, res) {
    try {
      const { businessId, serviceId, amount, description } = req.body;
      const userProfileId = req.user.profileId; // From auth middleware

      const result = await pointsService.addPoints({
        userProfileId,
        businessId,
        serviceId,
        amount,
        description
      });

      res.status(200).json({
        status: 'success',
        message: 'Points added successfully',
        data: result
      });
    } catch (error) {
      console.error('Add points error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to add points'
      });
    }
  }

  /**
   * Deduct points from user account
   */
  async deductPoints(req, res) {
    try {
      const { businessId, amount, description } = req.body;
      const userProfileId = req.user.profileId;

      const result = await pointsService.deductPoints({
        userProfileId,
        businessId,
        amount,
        description
      });

      res.status(200).json({
        status: 'success',
        message: 'Points deducted successfully',
        data: result
      });
    } catch (error) {
      console.error('Deduct points error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to deduct points'
      });
    }
  }

  /**
   * Get points balance
   */
  async getBalance(req, res) {
    try {
      const { businessId } = req.params;
      const userProfileId = req.user.profileId;

      const balance = await pointsService.getPointsBalance(userProfileId, businessId);

      res.status(200).json({
        status: 'success',
        data: { balance }
      });
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get points balance'
      });
    }
  }

  /**
   * Get points history
   */
  async getHistory(req, res) {
    try {
      const userProfileId = req.user.profileId;
      const { businessId, type } = req.query;

      const history = await pointsService.getPointsHistory(userProfileId, {
        businessId,
        type
      });

      res.status(200).json({
        status: 'success',
        data: { history }
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get points history'
      });
    }
  }

  /**
   * Get expiring points
   */
  async getExpiringPoints(req, res) {
    try {
      const userProfileId = req.user.profileId;
      const { days } = req.query;

      const expiringPoints = await pointsService.getExpiringPoints(
        userProfileId,
        parseInt(days) || 30
      );

      res.status(200).json({
        status: 'success',
        data: { expiringPoints }
      });
    } catch (error) {
      console.error('Get expiring points error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get expiring points'
      });
    }
  }
}

module.exports = new PointsController();