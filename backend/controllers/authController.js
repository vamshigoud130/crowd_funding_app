import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import emailService from '../utils/emailSender.js';
import crypto from 'crypto';

// Generate JWT token
const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

//   Register user
//   POST /api/auth/register
//  Public
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Registration validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists for email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token (only if not admin)
    const verificationToken = role === 'admin' ? undefined : crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken,
      isVerified: (role === 'admin' || !requireVerification) ? true : false
    });

    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: (role === 'admin' || !requireVerification)
        ? 'Registration successful!'
        : 'Registration successful! Please check your email to verify your account.'
    };

    // Send verification email (only if not admin)
    if (role !== 'admin') {
      emailService.sendVerificationEmail(user.email, user.name, verificationToken).catch(err => {
        console.error('Failed to send verification email:', err);
      });
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error occurred:', error);
    res.status(500).json({ message: error.message });
  }
};

//   Login user
//   POST /api/auth/login
//  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }

    // Check if email is verified (bypass for admin and development)
    if (!user.isVerified && user.role !== 'admin' && requireVerification) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    if (await user.comparePassword(password)) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      });
      // Send login notification
      emailService.sendLoginNotification(user.email, user.name).catch(err => {
        console.error('Failed to send login notification:', err);
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Admin login
//    POST /api/auth/admin-login
//   Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    console.log("Entered Email:", email);
    console.log("User from DB:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if email is verified (bypass for admin and development)
    if (!user.isVerified && user.role !== 'admin' && requireVerification) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    console.log("User Role:", user.role);

    const isMatch = await user.comparePassword(password);
    console.log("Password Match:", isMatch);

    if (user.role === 'admin' && isMatch) {
      const token = generateToken(user._id);

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token
      });

      // Send login notification
      emailService.sendLoginNotification(user.email, user.name).catch(err => {
        console.error('Failed to send login notification:', err);
      });
    } else {
      res.status(401).json({
        message: "Role or password incorrect"
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get user profile
//    GET /api/auth/profile
//   Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Update user profile
//    PUT /api/auth/profile
//   Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// logout user
const logout = async (req, res) => {
  try {
    // Invalidate token by sending an empty token with immediate expiration
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Verify Email
//   GET /api/auth/verify-email/:token
//  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #ef4444;">Invalid Verification Link</h1>
            <p>This verification link is invalid or has expired.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="color: #10b981;">Go to Login</a>
          </body>
        </html>
      `);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?verified=true`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  logout,
  verifyEmail
};



