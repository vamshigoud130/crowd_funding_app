import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import User from '../models/User.js';

class AnalyticsService {
  async getPlatformStats() {
    try {
      const [
        totalUsers,
        totalCampaigns,
        activeCampaigns,
        totalDonations,
        totalDonationAmount
      ] = await Promise.all([
        User.countDocuments(),
        Campaign.countDocuments(),
        Campaign.countDocuments({ status: 'approved' }),
        Donation.countDocuments(),
        Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
      ]);

      return {
        totalUsers,
        totalCampaigns,
        activeCampaigns,
        totalDonations,
        totalDonationAmount: totalDonationAmount[0]?.total || 0
      };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      return {};
    }
  }

  async getCategoryStats() {
    try {
      const categoryStats = await Campaign.aggregate([
        { $match: { status: 'approved' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalGoal: { $sum: '$goalAmount' },
            totalRaised: { $sum: '$currentAmount' }
          }
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            totalGoal: 1,
            totalRaised: 1,
            _id: 0
          }
        }
      ]);

      return categoryStats;
    } catch (error) {
      console.error('Error getting category stats:', error);
      return [];
    }
  }

  async getDonationTrends(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const trends = await Donation.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            amount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      return trends;
    } catch (error) {
      console.error('Error getting donation trends:', error);
      return [];
    }
  }

  async getTopPerformers(limit = 10) {
    try {
      const topCampaigns = await Campaign.aggregate([
        { $match: { status: 'approved' } },
        {
          $lookup: {
            from: 'donations',
            localField: '_id',
            foreignField: 'campaignId',
            as: 'donations'
          }
        },
        {
          $addFields: {
            totalRaised: { $sum: '$donations.amount' },
            donorCount: { $size: '$donations' }
          }
        },
        { $sort: { totalRaised: -1 } },
        { $limit: limit },
        {
          $project: {
            title: 1,
            totalRaised: 1,
            donorCount: 1,
            goalAmount: 1,
            category: 1
          }
        }
      ]);

      return topCampaigns;
    } catch (error) {
      console.error('Error getting top performers:', error);
      return [];
    }
  }

  async getUserEngagementStats() {
    try {
      const engagementStats = await User.aggregate([
        {
          $lookup: {
            from: 'donations',
            localField: '_id',
            foreignField: 'donorId',
            as: 'donations'
          }
        },
        {
          $lookup: {
            from: 'campaigns',
            localField: '_id',
            foreignField: 'creatorId',
            as: 'campaigns'
          }
        },
        {
          $group: {
            _id: null,
            totalDonors: {
              $sum: { $cond: [{ $gt: [{ $size: '$donations' }, 0] }, 1, 0] }
            },
            totalCreators: {
              $sum: { $cond: [{ $gt: [{ $size: '$campaigns' }, 0] }, 1, 0] }
            },
            averageDonationsPerDonor: { $avg: { $size: '$donations' } },
            averageCampaignsPerCreator: { $avg: { $size: '$campaigns' } }
          }
        }
      ]);

      return engagementStats[0] || {};
    } catch (error) {
      console.error('Error getting user engagement stats:', error);
      return {};
    }
  }
}

export default new AnalyticsService();