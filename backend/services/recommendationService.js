import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import User from '../models/User.js';

class RecommendationService {
  async getRecommendedCampaigns(userId, limit = 10) {
    try {
      // Get user's donation history
      const userDonations = await Donation.find({ donorId: userId })
        .populate('campaignId', 'category');

      // Extract preferred categories
      const preferredCategories = [...new Set(
        userDonations.map(d => d.campaignId?.category).filter(Boolean)
      )];

      // Get popular campaigns in preferred categories
      let recommendations = await Campaign.find({
        status: 'approved',
        category: { $in: preferredCategories }
      })
      .populate('creatorId', 'name profileImage')
      .sort({ currentAmount: -1, createdAt: -1 })
      .limit(limit);

      // If not enough recommendations, add popular campaigns from other categories
      if (recommendations.length < limit) {
        const additionalCampaigns = await Campaign.find({
          status: 'approved',
          category: { $nin: preferredCategories }
        })
        .populate('creatorId', 'name profileImage')
        .sort({ currentAmount: -1, createdAt: -1 })
        .limit(limit - recommendations.length);

        recommendations = [...recommendations, ...additionalCampaigns];
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Return popular campaigns as fallback
      return await Campaign.find({ status: 'approved' })
        .populate('creatorId', 'name profileImage')
        .sort({ currentAmount: -1 })
        .limit(limit);
    }
  }

  async getTrendingCampaigns(limit = 10) {
    try {
      // Get campaigns with most donations in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const trendingCampaigns = await Campaign.aggregate([
        {
          $lookup: {
            from: 'donations',
            localField: '_id',
            foreignField: 'campaignId',
            as: 'recentDonations'
          }
        },
        {
          $addFields: {
            recentDonationCount: {
              $size: {
                $filter: {
                  input: '$recentDonations',
                  cond: { $gte: ['$$this.createdAt', thirtyDaysAgo] }
                }
              }
            },
            recentDonationAmount: {
              $sum: {
                $filter: {
                  input: '$recentDonations',
                  cond: { $gte: ['$$this.createdAt', thirtyDaysAgo] }
                }
              }
            }
          }
        },
        { $match: { status: 'approved' } },
        { $sort: { recentDonationAmount: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'creatorId',
            foreignField: '_id',
            as: 'creator'
          }
        },
        {
          $project: {
            title: 1,
            description: 1,
            category: 1,
            goalAmount: 1,
            currentAmount: 1,
            deadline: 1,
            images: 1,
            trustScore: 1,
            'creator.name': 1,
            'creator.profileImage': 1
          }
        }
      ]);

      return trendingCampaigns;
    } catch (error) {
      console.error('Error getting trending campaigns:', error);
      return [];
    }
  }

  async getSimilarCampaigns(campaignId, limit = 5) {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) return [];

      const similarCampaigns = await Campaign.find({
        _id: { $ne: campaignId },
        status: 'approved',
        category: campaign.category
      })
      .populate('creatorId', 'name profileImage')
      .sort({ currentAmount: -1 })
      .limit(limit);

      return similarCampaigns;
    } catch (error) {
      console.error('Error getting similar campaigns:', error);
      return [];
    }
  }
}

export default new RecommendationService();