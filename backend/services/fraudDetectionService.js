import Campaign from '../models/Campaign.js';
import User from '../models/User.js';

class FraudDetectionService {
  async detectFraud(campaignData) {
    let score = 0;
    const reasons = [];

    try {
      // Check for duplicate descriptions (40%)
      const similarCampaigns = await Campaign.find({
        description: { $regex: campaignData.description, $options: 'i' },
        status: { $ne: 'rejected' }
      });

      if (similarCampaigns.length > 0) {
        score += 40;
        reasons.push('Similar campaign description found');
      }

      // Check deadline risk (20%) - too short deadline
      const daysUntilDeadline = Math.ceil((campaignData.deadline - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline < 7) {
        score += 20;
        reasons.push('Deadline too short');
      }

      // Check creator history (20%) - multiple pending campaigns
      const userCampaigns = await Campaign.find({
        creatorId: campaignData.creatorId,
        status: 'pending'
      });

      if (userCampaigns.length > 2) {
        score += 20;
        reasons.push('Multiple pending campaigns by same creator');
      }

      // Check document verification (20%) - no documents uploaded
      // This would be checked when documents are uploaded, for now assume no docs
      if (!campaignData.documents || campaignData.documents.length === 0) {
        score += 20;
        reasons.push('No verification documents uploaded');
      }

      return {
        isFraudulent: score > 50,
        score,
        reasons
      };
    } catch (error) {
      console.error('Error in fraud detection:', error);
      return {
        isFraudulent: false,
        score: 0,
        reasons: []
      };
    }
  }

  async checkCampaignSimilarity(description) {
    // Simple text similarity check
    const campaigns = await Campaign.find({ status: 'approved' });
    
    for (const campaign of campaigns) {
      const similarity = this.calculateSimilarity(description, campaign.description);
      if (similarity > 0.8) { // 80% similarity threshold
        return true;
      }
    }
    return false;
  }

  calculateSimilarity(str1, str2) {
    // Simple Jaccard similarity
    const set1 = new Set(str1.toLowerCase().split(' '));
    const set2 = new Set(str2.toLowerCase().split(' '));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
}

export default new FraudDetectionService();