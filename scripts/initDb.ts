import mongoose from 'mongoose';
import { User } from '../src/utils/dbSchema';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const initDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB Atlas');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
    } else {
      // Create a super admin user
      const hashedPassword = await bcrypt.hash('changeme123', 10);
      const superAdmin = new User({
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin'
      });

      await superAdmin.save();
      console.log('Super admin created');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDb();