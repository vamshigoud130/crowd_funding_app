import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';
import emailService from '../utils/emailSender.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

//   Create Razorpay order
//   POST /api/donations/create-order
//  Private/Public (Optional Auth)
const createOrder = async (req, res) => {
  try {
    const { amount, campaignId } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Amount must be at least ₹1' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'Campaign not available for donations' });
    }

    // Check if goal is already reached
    if (campaign.currentAmount >= campaign.goalAmount) {
      return res.status(400).json({ 
        message: 'This campaign has already reached its goal. No further donations are needed. Thank you for your support!' 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        campaignId: campaignId,
        donorId: req.user ? req.user._id.toString() : 'guest',
        campaignTitle: campaign.title
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      campaignTitle: campaign.title
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: error.description || 'Failed to create payment order' });
  }
};

//     Verify Razorpay payment and create donation
//    POST /api/donations/verify-payment
//   Private/Public (Optional Auth)
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      campaignId,
      amount,
      message,
      anonymous,
      guestName,
      guestEmail
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Payment verified — create donation
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Final check to prevent over-funding if multiple people are paying at once
    if (campaign.currentAmount >= campaign.goalAmount) {
      return res.status(400).json({ message: 'Campaign goal already reached.' });
    }

    const donationData = {
      campaignId,
      amount,
      anonymous: anonymous || false,
      paymentId: razorpay_payment_id,
      message
    };

    if (req.user) {
      donationData.donorId = req.user._id;
    } else {
      donationData.guestName = guestName;
      donationData.guestEmail = guestEmail;
    }

    const donation = await Donation.create(donationData);

    // Update campaign current amount
    campaign.currentAmount += amount;
    await campaign.save();

    // Add to user's donations (only if logged in)
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { donations: donation._id }
      });
    }

    // Determine display name for real-time and notification updates
    const donorDisplayName = anonymous ? 'Anonymous' : (req.user ? req.user.name : (guestName || 'Supporter'));

    // Emit real-time update
    const io = getIO();
    io.to(campaignId).emit('donationMade', {
      campaignId,
      amount,
      donorName: donorDisplayName,
      totalAmount: campaign.currentAmount
    });

    // Send donation confirmation email to donor
    const targetEmail = req.user ? req.user.email : guestEmail;
    const targetName = req.user ? req.user.name : (guestName || 'Supporter');

    if (targetEmail) {
      emailService.sendDonationConfirmation(targetEmail, targetName, campaign.title, amount).catch(err => {
        console.error('Failed to send donation confirmation:', err);
      });
    }

    // Notify campaign owner about the new donation
    const campaignOwner = await User.findById(campaign.creatorId);
    if (campaignOwner && campaignOwner.email) {
      emailService.sendDonationReceivedNotification(
        campaignOwner.email,
        campaignOwner.name,
        donorDisplayName,
        campaign.title,
        amount,
        campaign.currentAmount
      ).catch(err => {
        console.error('Failed to send donation received notification:', err);
      });

      // Send goal reached notification if goal amount is reached
      if (campaign.currentAmount >= campaign.goalAmount) {
        emailService.sendGoalReachedNotification(
          campaignOwner.email,
          campaignOwner.name,
          campaign.title,
          campaign.goalAmount
        ).catch(err => {
          console.error('Failed to send goal reached notification:', err);
        });
      }
    }

    res.status(201).json({
      success: true,
      donation,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

//     Create donation (legacy/fallback without Razorpay)
//    POST /api/donations
//   Private/Public (Optional Auth)
const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, anonymous, paymentId, referralId, message, guestName, guestEmail } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'Campaign not available for donations' });
    }

    if (campaign.currentAmount >= campaign.goalAmount) {
      return res.status(400).json({ message: 'This campaign has already reached its goal.' });
    }

    const donationData = {
      campaignId,
      amount,
      anonymous: anonymous || false,
      paymentId,
      referralId,
      message
    };

    if (req.user) {
      donationData.donorId = req.user._id;
    } else {
      donationData.guestName = guestName;
      donationData.guestEmail = guestEmail;
    }

    const donation = await Donation.create(donationData);

    // Update campaign current amount
    campaign.currentAmount += amount;
    await campaign.save();

    // Add to user's donations (only if logged in)
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { donations: donation._id }
      });
    }

    // Determine display name
    const donorDisplayName = anonymous ? 'Anonymous' : (req.user ? req.user.name : (guestName || 'Supporter'));

    // Emit real-time update
    const io = getIO();
    io.to(campaignId).emit('donationMade', {
      campaignId,
      amount,
      donorName: donorDisplayName,
      totalAmount: campaign.currentAmount
    });

    // Send donation confirmation email to donor
    const targetEmail = req.user ? req.user.email : guestEmail;
    const targetName = req.user ? req.user.name : (guestName || 'Supporter');

    if (targetEmail) {
      emailService.sendDonationConfirmation(targetEmail, targetName, campaign.title, amount).catch(err => {
        console.error('Failed to send donation confirmation:', err);
      });
    }

    // Notify campaign owner about the new donation
    const campaignOwner = await User.findById(campaign.creatorId);
    if (campaignOwner && campaignOwner.email) {
      emailService.sendDonationReceivedNotification(
        campaignOwner.email,
        campaignOwner.name,
        donorDisplayName,
        campaign.title,
        amount,
        campaign.currentAmount
      ).catch(err => {
        console.error('Failed to send donation received notification:', err);
      });

      // Send goal reached notification if goal amount is reached
      if (campaign.currentAmount >= campaign.goalAmount) {
        emailService.sendGoalReachedNotification(
          campaignOwner.email,
          campaignOwner.name,
          campaign.title,
          campaign.goalAmount
        ).catch(err => {
          console.error('Failed to send goal reached notification:', err);
        });
      }
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get campaign donations
//    GET /api/donations/campaign/:campaignId
//   Public
const getCampaignDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ campaignId: req.params.campaignId })
      .populate('donorId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get user donations
//    GET /api/donations/user/:userId
//   Private
const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.params.userId })
      .populate('campaignId', 'title images')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get all donations (Admin)
//    GET /api/donations
//   Private (Admin)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
      .populate('donorId', 'name email')
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get Razorpay key for frontend
//    GET /api/donations/razorpay-key
//   Public
const getRazorpayKey = async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
};

export {
  createOrder,
  verifyPayment,
  createDonation,
  getCampaignDonations,
  getUserDonations,
  getAllDonations,
  getRazorpayKey
};