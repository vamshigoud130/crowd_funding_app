import express from 'express';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getUserCampaigns,
  getPublicStats
} from '../controllers/campaignController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCampaigns);
router.get('/stats', getPublicStats);
router.get('/user/:userId', getUserCampaigns);
router.get('/:id', getCampaign);

// Protected routes
router.post('/', protect, createCampaign);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);

export default router;