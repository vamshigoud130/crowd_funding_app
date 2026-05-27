import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import FraudLog from '../models/FraudLog.js';
import Milestone from '../models/Milestone.js';
import emailService from '../utils/emailSender.js';

//     Get pending campaigns
//    GET /api/admin/campaigns/pending
//   Private (Admin)
const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'pending' })
      .populate('creatorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Approve campaign
//    PUT /api/admin/campaigns/:id/approve
//  Private (Admin)
const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('creatorId', 'name email');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creatorId && campaign.creatorId.email) {
      emailService.sendCampaignApproval(campaign.creatorId.email, campaign.title).catch(err => {
        console.error('Failed to send campaign approval email:', err);
      });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Reject campaign
//    PUT /api/admin/campaigns/:id/reject
//   Private (Admin)
const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('creatorId', 'name email');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creatorId && campaign.creatorId.email) {
      emailService.sendCampaignRejection(campaign.creatorId.email, campaign.title, "Admin decision").catch(err => {
        console.error('Failed to send campaign rejection email:', err);
      });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get fraud logs
//    GET /api/admin/fraud-logs
//   Private (Admin)
const getFraudLogs = async (req, res) => {
  try {
    const fraudLogs = await FraudLog.find({})
      .populate('campaignId', 'title creatorId')
      .sort({ createdAt: -1 });

    res.json(fraudLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Release milestone funds
//    PUT /api/admin/milestones/:id/release
//   Private (Admin)
const releaseMilestoneFunds = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.status = 'released';
    milestone.releasedAt = new Date();
    await milestone.save();

    // Send milestone update email to the campaign owner
    const campaign = await Campaign.findById(milestone.campaignId).populate('creatorId', 'name email');
    if (campaign && campaign.creatorId && campaign.creatorId.email) {
      emailService.sendMilestoneUpdate(campaign.creatorId.email, campaign.title, milestone.title).catch(err => {
        console.error('Failed to send milestone update email:', err);
      });
    }

    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get all users
//    GET /api/admin/users
//   Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Delete campaign (Admin)
//    DELETE /api/admin/campaigns/:id
//   Private (Admin)
const deleteCampaignByAdmin = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('creatorId', 'name email');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const creatorEmail = campaign.creatorId?.email;
    const creatorName = campaign.creatorId?.name;
    const campaignTitle = campaign.title;

    // Remove campaign reference from user
    if (campaign.creatorId?._id) {
      await User.findByIdAndUpdate(campaign.creatorId._id, {
        $pull: { createdCampaigns: campaign._id }
      });
    }

    await Campaign.findByIdAndDelete(req.params.id);

    // Notify the campaign creator
    if (creatorEmail) {
      emailService.sendCampaignRejection(creatorEmail, campaignTitle, 'Your campaign has been removed by the admin team.').catch(err => {
        console.error('Failed to send campaign deletion email:', err);
      });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//    Block/Unblock user
//    PUT /api/admin/users/:id/block
//   Private (Admin)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block an admin user' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  getFraudLogs,
  releaseMilestoneFunds,
  getAllUsers,
  deleteCampaignByAdmin,
  toggleBlockUser
};