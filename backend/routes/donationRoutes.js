import express from 'express';
import {
  createOrder,
  verifyPayment,
  createDonation,
  getCampaignDonations,
  getUserDonations,
  getAllDonations,
  getRazorpayKey
} from '../controllers/donationController.js';
import { protect, protectOptional, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/campaign/:campaignId', getCampaignDonations);
router.get('/razorpay-key', getRazorpayKey);

// Razorpay payment routes
router.post('/create-order', protectOptional, createOrder);
router.post('/verify-payment', protectOptional, verifyPayment);

// Legacy donation route (fallback)
router.post('/', protectOptional, createDonation);

// User routes
router.get('/user/:userId', protect, getUserDonations);

// Admin routes
router.get('/', protect, admin, getAllDonations);

export default router;