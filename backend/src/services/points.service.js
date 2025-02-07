const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PointsService {
  /**
   * Add points to user account
   */
  async addPoints(data) {
    const { userProfileId, businessId, serviceId, amount, description } = data;

    return await prisma.point.create({
      data: {
        userProfileId,
        businessId,
        serviceId,
        amount,
        type: 'earned',
        source: data.source || 'service_booking',
        description,
        expiryDate: this.calculateExpiryDate()
      },
      include: {
        userProfile: true,
        business: true,
        service: true
      }
    });
  }

  /**
   * Deduct points from user account
   */
  async deductPoints(data) {
    const { userProfileId, businessId, amount, description } = data;

    // Check if user has enough points
    const balance = await this.getPointsBalance(userProfileId, businessId);
    if (balance < amount) {
      throw new Error('Insufficient points balance');
    }

    return await prisma.point.create({
      data: {
        userProfileId,
        businessId,
        amount: -amount, // Negative amount for deduction
        type: 'spent',
        source: data.source || 'reward_redemption',
        description
      }
    });
  }

  /**
   * Get points balance for a user at a specific business
   */
  async getPointsBalance(userProfileId, businessId) {
    const points = await prisma.point.findMany({
      where: {
        userProfileId,
        businessId,
        expiryDate: {
          gt: new Date() // Only consider non-expired points
        }
      }
    });

    return points.reduce((total, point) => total + point.amount, 0);
  }

  /**
   * Get points history for a user
   */
  async getPointsHistory(userProfileId, filters = {}) {
    return await prisma.point.findMany({
      where: {
        userProfileId,
        ...(filters.businessId && { businessId: filters.businessId }),
        ...(filters.type && { type: filters.type })
      },
      include: {
        business: true,
        service: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Calculate points expiry date (default: 1 year from now)
   */
  calculateExpiryDate(months = 12) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);
    return expiryDate;
  }

  /**
   * Get expiring points for a user
   */
  async getExpiringPoints(userProfileId, daysThreshold = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return await prisma.point.findMany({
      where: {
        userProfileId,
        type: 'earned',
        expiryDate: {
          gt: new Date(),
          lt: thresholdDate
        }
      },
      include: {
        business: true
      }
    });
  }
}

module.exports = new PointsService();