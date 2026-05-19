import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import User from '../models/User.js';

//    Get analytics dashboard data
//    GET /api/analytics/dashboard
//   Private (Admin)
const getDashboardData = async (req, res) => {
  try {
    // Total donations
    const totalDonations = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Active campaigns
    const activeCampaigns = await Campaign.countDocuments({ status: 'approved' });

    // Total users
    const totalUsers = await User.countDocuments();

    // Category distribution
    const categoryStats = await Campaign.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily donation trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrends = await Donation.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Top campaigns
    const topCampaigns = await Campaign.aggregate([
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
          totalDonations: { $sum: '$donations.amount' }
        }
      },
      { $sort: { totalDonations: -1 } },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          totalDonations: 1,
          goalAmount: 1
        }
      }
    ]);

    res.json({
      totalDonations: totalDonations[0]?.total || 0,
      activeCampaigns,
      totalUsers,
      categoryStats,
      dailyTrends,
      topCampaigns
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get campaign analytics
//    GET /api/analytics/campaigns/:id
//   Private (Creator or Admin)
const getCampaignAnalytics = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check permissions
    if (campaign.creatorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Donation stats
    const donationStats = await Donation.aggregate([
      { $match: { campaignId: campaign._id } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonors: { $sum: 1 },
          averageDonation: { $avg: '$amount' }
        }
      }
    ]);

    // Daily donations
    const dailyDonations = await Donation.aggregate([
      { $match: { campaignId: campaign._id } },
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

    res.json({
      campaign: {
        title: campaign.title,
        goalAmount: campaign.goalAmount,
        currentAmount: campaign.currentAmount,
        status: campaign.status
      },
      donationStats: donationStats[0] || {
        totalAmount: 0,
        totalDonors: 0,
        averageDonation: 0
      },
      dailyDonations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getDashboardData,
  getCampaignAnalytics
};