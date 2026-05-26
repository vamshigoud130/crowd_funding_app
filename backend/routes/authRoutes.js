import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  logout,
  verifyEmail
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const BLOCKED_DOMAINS = [
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.org',
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'sharklasers.com', 
  'guerrillamail.com', 'dispostable.com', 'getairmail.com', 'maildrop.cc', 
  'trashmail.com', 'burnermail.io', 'tempmail.net', 'example.com', 'test.com', 
  'invalid.com', 'domain.com', 'mock.com', 'spambog.com', 'mailcatch.com', 
  'mailexpire.com', 'mailness.com'
];

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .custom(async (value) => {
      if (!value) return false;
      const parts = value.split('@');
      const username = parts[0];
      const domain = parts[1];

      if (!username || username.length < 1) {
        throw new Error('Email username part must be at least 1 character long');
      }

      if (domain) {
        if (BLOCKED_DOMAINS.includes(domain.toLowerCase())) {
          throw new Error('Registration with disposable or test email addresses is not allowed');
        }
      }
      return true;
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/admin-login', loginValidation, adminLogin);
router.get('/verify-email/:token', verifyEmail);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;