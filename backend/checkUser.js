const mongoose = require('mongoose');
const User = require('./models/User');

const checkUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crowdfunding', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Find user
    const user = await User.findOne({ email: 'admin50@example.com' });
    if (user) {
      console.log('User found:', {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: user.password.substring(0, 20) + '...'
      });
    } else {
      console.log('User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();