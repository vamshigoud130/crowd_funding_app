import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import FraudLog from '../models/FraudLog.js';
import { getIO } from '../config/socket.js';
import cloudinary from '../config/cloudinary.js';
import trustScoreService from '../services/trustScoreService.js';
import fraudDetectionService from '../services/fraudDetectionService.js';
import emailService from '../utils/emailSender.js';
import Donation from '../models/Donation.js';

// Helpers to attach unique donors count to campaigns
const attachDonorsCountToCampaign = async (campaign) => {
  if (!campaign) return campaign;
  const plainCampaign = campaign.toObject ? campaign.toObject() : campaign;
  const uniqueDonors = await Donation.distinct('donorId', { campaignId: campaign._id });
  plainCampaign.donorsCount = uniqueDonors.length;
  plainCampaign.donors = uniqueDonors.length;
  return plainCampaign;
};

const attachDonorsCountToCampaigns = async (campaigns) => {
  if (!campaigns || campaigns.length === 0) return campaigns;
  const campaignIds = campaigns.map(c => c._id);
  const donationStats = await Donation.aggregate([
    { $match: { campaignId: { $in: campaignIds } } },
    { $group: { _id: '$campaignId', uniqueDonors: { $addToSet: '$donorId' } } }
  ]);
  const statsMap = {};
  donationStats.forEach(stat => {
    statsMap[stat._id.toString()] = stat.uniqueDonors.length;
  });
  return campaigns.map(campaign => {
    const plainCampaign = campaign.toObject ? campaign.toObject() : campaign;
    const count = statsMap[campaign._id.toString()] || 0;
    plainCampaign.donorsCount = count;
    plainCampaign.donors = count;
    return plainCampaign;
  });
};

// Helpers
const uploadImageIfNeeded = async (imageData) => {
  if (!imageData || typeof imageData !== 'string') return imageData;
  // If it is already a URL, leave it as-is.
  if (!imageData.startsWith('data:')) return imageData;

  // Skip upload if Cloudinary is not configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return imageData; // Return the base64 data as-is for now
  }

  const uploadRes = await cloudinary.uploader.upload(imageData, {
    folder: 'campaigns',
    resource_type: 'image'
  });
  return uploadRes.secure_url;
};

//    Get all campaigns
//    GET /api/campaigns
//   Public (returns approved campaigns by default)
const getCampaigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const status = req.query.status; // optional
    const search = req.query.search;

    let query = {};

    // Default to approved campaigns for public users (unless status is explicitly specified)
    query.status = status || 'approved';
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const campaigns = await Campaign.find(query)
      .populate('creatorId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Campaign.countDocuments(query);

    const enrichedCampaigns = await attachDonorsCountToCampaigns(campaigns);

    res.json({
      campaigns: enrichedCampaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get single campaign
//    GET /api/campaigns/:id
//   Public
const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creatorId', 'name profileImage verified');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const enrichedCampaign = await attachDonorsCountToCampaign(campaign);
    res.json(enrichedCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Create campaign
//    POST /api/campaigns
//   Private
const createCampaign = async (req, res) => {
  try {
    console.log("createCampaign received:", req.body);
    console.log("User from token:", req.user);

    let { title, description, category, goalAmount, deadline, impactUnit, images } = req.body;

    // Validate required fields
    if (!title || title.trim() === "") return res.status(400).json({ message: 'Title is required' });
    if (!description || description.trim() === "") return res.status(400).json({ message: 'Description is required' });
    if (!category) return res.status(400).json({ message: 'Category is required' });
    if (!goalAmount) return res.status(400).json({ message: 'Goal amount is required' });
    if (!deadline) return res.status(400).json({ message: 'Deadline is required' });

    // Parse goalAmount as number
    goalAmount = Number(goalAmount);
    if (isNaN(goalAmount) || goalAmount < 1) {
      return res.status(400).json({ message: 'Invalid goal amount - must be a number >= 1' });
    }

    // Parse deadline as Date
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ message: `Invalid deadline date format. Received: ${deadline}` });
    }

    // Calculate trust score
    const trustScore = await trustScoreService.calculateTrustScore(req.user._id);

    // Fraud detection
    const fraudResult = await fraudDetectionService.detectFraud({
      title,
      description,
      deadline: parsedDeadline,
      creatorId: req.user._id
    });



    // Normalize image(s) data and upload any base64 image into Cloudinary
    const parsedImages = (() => {
      if (!images) return [];
      if (Array.isArray(images)) return images;
      return [images];
    })();

    const uploadedImages = await Promise.all(
      parsedImages.map((img) => uploadImageIfNeeded(img))
    );

    const campaign = await Campaign.create({
      title,
      description,
      category,
      goalAmount,
      deadline: parsedDeadline,
      creatorId: req.user._id,
      trustScore,
      impactUnit,
      images: uploadedImages.filter(Boolean)
    });

    // Log fraud if detected
    if (fraudResult.isFraudulent) {
      await FraudLog.create({
        campaignId: campaign._id,
        riskScore: fraudResult.score,
        reasons: fraudResult.reasons
      });
    }

    // Add to user's created campaigns
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCampaigns: campaign._id }
    });

    // Send campaign creation notification
    emailService.sendCampaignCreation(req.user.email, campaign.title).catch(err => {
      console.error('Failed to send campaign creation email:', err);
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Campaign creation error:", error);
    res.status(500).json({ message: error.message || "Failed to create campaign" });
  }
};

//    Update campaign
//    PUT /api/campaigns/:id
//   Private (Creator only)
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creatorId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Normalize stretch goals (support JSON string from form-data)
    const { stretchGoals, images } = req.body;
    const parsedStretchGoals = typeof stretchGoals === 'string'
      ? (() => { try { return JSON.parse(stretchGoals); } catch { return []; } })()
      : stretchGoals || [];

    const parsedImages = (() => {
      if (!images) return [];
      if (Array.isArray(images)) return images;
      return [images];
    })();

    const uploadedImages = await Promise.all(
      parsedImages.map((img) => uploadImageIfNeeded(img))
    );

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        stretchGoals: parsedStretchGoals,
        images: uploadedImages.filter(Boolean)
      },
      { new: true }
    );

    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Delete campaign
//    DELETE /api/campaigns/:id
//   Private (Creator only)
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creatorId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get user's campaigns
//    GET /api/campaigns/user/:userId
//   Public
const getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creatorId: req.params.userId })
      .sort({ createdAt: -1 });

    const enrichedCampaigns = await attachDonorsCountToCampaigns(campaigns);
    res.json(enrichedCampaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public application statistics
// @route   GET /api/campaigns/stats
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments({ status: { $in: ['approved', 'completed'] } });
    
    // Calculate total raised amount across all campaigns
    const campaigns = await Campaign.find({ status: { $in: ['approved', 'completed'] } });
    const totalRaised = campaigns.reduce((acc, c) => acc + (c.currentAmount || 0), 0);

    // Count of unique donors across all donations
    const uniqueDonors = await Donation.distinct('donorId');
    const totalDonors = uniqueDonors.length;

    // Estimate lives impacted based on total donors and campaigns
    const livesImpacted = Math.max(0, totalDonors * 3 + totalCampaigns * 5);

    res.json({
      campaignsCount: totalCampaigns,
      totalRaised,
      totalDonors,
      livesImpacted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getUserCampaigns,
  getPublicStats
};