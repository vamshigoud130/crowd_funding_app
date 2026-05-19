import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import emailService from '../utils/emailSender.js';

// Generate JWT token
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
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Add token for admin users
    if (user.role === 'admin') {
      response.token = generateToken(user._id);
    }

    // Send welcome email
    emailService.sendWelcomeEmail(user.email, user.name).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(201).json(response);
  } catch (error) {
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

export {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  logout
};



