import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

class TrustScoreService {
  async calculateTrustScore(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return 0;

      let score = 0;

      // Identity verification (30%)
      score += user.verified ? 30 : 0;

      // Documents uploaded (30%) - check user's campaigns
      const campaigns = await Campaign.find({ creatorId: userId });
      const hasDocuments = campaigns.some(campaign => campaign.documents.length > 0);
      score += hasDocuments ? 30 : 0;

      // Description quality (20%) - basic check
      const hasDetailedDescriptions = campaigns.some(campaign => 
        campaign.description && campaign.description.length > 100
      );
      score += hasDetailedDescriptions ? 20 : 0;

      // Creator history (20%) - based on number of campaigns and success rate
      const totalCampaigns = campaigns.length;
      const successfulCampaigns = campaigns.filter(c => c.status === 'completed').length;
      const successRate = totalCampaigns > 0 ? (successfulCampaigns / totalCampaigns) * 20 : 0;
      score += successRate;

      return Math.min(100, Math.max(0, score));
    } catch (error) {
      console.error('Error calculating trust score:', error);
      return 0;
    }
  }

  async updateTrustScore(campaignId) {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) return;

      const trustScore = await this.calculateTrustScore(campaign.creatorId);
      campaign.trustScore = trustScore;
      await campaign.save();
    } catch (error) {
      console.error('Error updating trust score:', error);
    }
  }
}

export default new TrustScoreService();