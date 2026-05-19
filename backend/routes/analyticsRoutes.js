import express from 'express';
import {
  getDashboardData,
  getCampaignAnalytics
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin dashboard
router.get('/dashboard', protect, admin, getDashboardData);

// Campaign analytics (creator or admin)
router.get('/campaigns/:id', protect, getCampaignAnalytics);

export default router;