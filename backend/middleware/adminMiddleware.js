import User from '../models/User.js';

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceField) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (user.role === 'admin') {
        return next();
      }
      
      // Check if user owns the resource
      if (req[resourceField] && req[resourceField].creatorId.toString() === req.user._id.toString()) {
        return next();
      }
      
      res.status(403).json({ message: 'Access denied' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

export {
  requireAdmin,
  requireOwnershipOrAdmin
};