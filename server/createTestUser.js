const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createTestUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@family.com' });
    if (existingUser) {
      console.log('✓ Test user already exists!');
      console.log('\nLogin Credentials:');
      console.log('Email: test@family.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create test family user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      name: 'Test Family',
      email: 'test@family.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'family',
    });
    await user.save();

    console.log('✅ Test family user created successfully!');
    console.log('\nLogin Credentials:');
    console.log('Email: test@family.com');
    console.log('Password: password123');
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
