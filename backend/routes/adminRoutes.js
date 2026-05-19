import express from 'express';
import {
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  getFraudLogs,
  releaseMilestoneFunds,
  getAllUsers,
  deleteCampaignByAdmin,
  toggleBlockUser
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(admin);

router.get('/campaigns/pending', getPendingCampaigns);
router.put('/campaigns/:id/approve', approveCampaign);
router.put('/campaigns/:id/reject', rejectCampaign);
router.delete('/campaigns/:id', deleteCampaignByAdmin);
router.get('/fraud-logs', getFraudLogs);
router.put('/milestones/:id/release', releaseMilestoneFunds);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);

export default router;