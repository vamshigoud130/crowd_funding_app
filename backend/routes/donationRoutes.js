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
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/campaign/:campaignId', getCampaignDonations);
router.get('/razorpay-key', getRazorpayKey);

// Razorpay payment routes
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);

// Legacy donation route (fallback)
router.post('/', protect, createDonation);

// User routes
router.get('/user/:userId', protect, getUserDonations);

// Admin routes
router.get('/', protect, admin, getAllDonations);

export default router;