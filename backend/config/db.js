import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const email = 'impactfunds1@gmail.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Seeder: Admin user already exists in database. Ensuring role, password, and active status...');
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      existingAdmin.password = 'admin123'; // Always reset to ensure it is admin123 (hashed via pre-save)
      await existingAdmin.save();
      console.log('Seeder: Admin user password, role, and verification status updated.');
    } else {
      console.log('Seeder: Admin user not found. Seeding admin user...');
      await User.create({
        name: 'Admin User',
        email: email,
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      console.log('Seeder: Admin user seeded successfully!');
    }
  } catch (error) {
    console.error('Seeder Error: Failed to seed admin user:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdfunding', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Run idempotent database seeding
    await seedAdmin();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;