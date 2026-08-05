const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Administrator';

const run = async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ email: ADMIN_EMAIL });
    if (exists) {
      if (exists.role === 'Admin') {
        console.log('Admin already exists. Skipping.');
        process.exit(0);
      } else {
        exists.role = 'Admin';
        await exists.save();
        console.log('Upgraded existing user to Admin.');
        process.exit(0);
      }
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = new User({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: 'Admin' });
    await user.save();
    console.log('Admin user created:', ADMIN_EMAIL);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
