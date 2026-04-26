const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Caregiver = require('./models/Caregiver');
const Review = require('./models/Review');

const fakeNurses = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@eldercare.com',
    phone: '9876543210',
    type: 'nurse',
    experience: 8,
    pricePerHour: 250,
    bio: 'Experienced registered nurse specializing in elderly care with expertise in chronic disease management and post-operative care.',
    rating: 4.8,
    reviews: 45,
    verified: true,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@eldercare.com',
    phone: '9876543211',
    type: 'nurse',
    experience: 5,
    pricePerHour: 200,
    bio: 'Compassionate male nurse with 5 years of experience in geriatric care. Specialized in dementia and Alzheimer\'s care.',
    rating: 4.6,
    reviews: 32,
    verified: true,
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@eldercare.com',
    phone: '9876543212',
    type: 'nurse',
    experience: 10,
    pricePerHour: 300,
    bio: 'Senior nurse with a decade of experience in home healthcare. Expert in diabetes management and physiotherapy assistance.',
    rating: 4.9,
    reviews: 67,
    verified: true,
  },
  {
    name: 'David Williams',
    email: 'david.williams@eldercare.com',
    phone: '9876543213',
    type: 'nurse',
    experience: 6,
    pricePerHour: 220,
    bio: 'Dedicated healthcare professional with strong background in cardiac care and medication management for elderly patients.',
    rating: 4.7,
    reviews: 38,
    verified: true,
  },
  {
    name: 'Anjali Patel',
    email: 'anjali.patel@eldercare.com',
    phone: '9876543214',
    type: 'nurse',
    experience: 7,
    pricePerHour: 240,
    bio: 'Caring nurse specializing in palliative care and pain management. Fluent in Hindi, English, and Gujarati.',
    rating: 4.8,
    reviews: 51,
    verified: true,
  },
  {
    name: 'Robert Martinez',
    email: 'robert.martinez@eldercare.com',
    phone: '9876543215',
    type: 'companion',
    experience: 4,
    pricePerHour: 150,
    bio: 'Friendly companion caregiver providing emotional support, daily activities assistance, and meal preparation.',
    rating: 4.5,
    reviews: 28,
    verified: true,
  },
  {
    name: 'Lakshmi Reddy',
    email: 'lakshmi.reddy@eldercare.com',
    phone: '9876543216',
    type: 'physiotherapist',
    experience: 9,
    pricePerHour: 280,
    bio: 'Certified physiotherapist specializing in geriatric rehabilitation, mobility improvement, and fall prevention.',
    rating: 4.9,
    reviews: 42,
    verified: true,
  },
  {
    name: 'James Anderson',
    email: 'james.anderson@eldercare.com',
    phone: '9876543217',
    type: 'nurse',
    experience: 12,
    pricePerHour: 350,
    bio: 'Highly experienced critical care nurse with expertise in ventilator management and emergency response for elderly.',
    rating: 5.0,
    reviews: 89,
    verified: true,
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@eldercare.com',
    phone: '9876543218',
    type: 'companion',
    experience: 3,
    pricePerHour: 120,
    bio: 'Patient and kind companion providing daily living assistance, light housekeeping, and companionship.',
    rating: 4.4,
    reviews: 19,
    verified: true,
  },
  {
    name: 'Thomas Brown',
    email: 'thomas.brown@eldercare.com',
    phone: '9876543219',
    type: 'physiotherapist',
    experience: 6,
    pricePerHour: 260,
    bio: 'Licensed physiotherapist focusing on post-stroke rehabilitation and arthritis management for seniors.',
    rating: 4.7,
    reviews: 35,
    verified: true,
  },
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing caregivers
    console.log('Clearing existing caregiver data...');
    await Caregiver.deleteMany({});
    console.log('Cleared caregivers');

    // Create caregivers
    console.log('Creating fake nurse profiles...');
    const createdCaregivers = [];

    for (const nurse of fakeNurses) {
      // Create user account for each caregiver
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = new User({
        name: nurse.name,
        email: nurse.email,
        password: hashedPassword,
        phone: nurse.phone,
        role: 'caregiver',
      });
      await user.save();

      // Create caregiver profile
      const caregiver = new Caregiver({
        userId: user._id,
        name: nurse.name,
        email: nurse.email,
        phone: nurse.phone,
        type: nurse.type,
        experience: nurse.experience,
        pricePerHour: nurse.pricePerHour,
        bio: nurse.bio,
        rating: nurse.rating,
        reviews: nurse.reviews,
        verified: nurse.verified,
        verificationStatus: 'approved',
      });
      await caregiver.save();
      createdCaregivers.push(caregiver);

      console.log(`✓ Created: ${nurse.name} (${nurse.type})`);
    }

    // Add some sample reviews for a few caregivers
    console.log('\nAdding sample reviews...');
    const sampleReviews = [
      { caregiverId: createdCaregivers[0]._id, userName: 'Rajesh Kumar', rating: 5, comment: 'Excellent care for my mother. Very professional and caring.' },
      { caregiverId: createdCaregivers[0]._id, userName: 'Anita Singh', rating: 5, comment: 'Sarah is amazing! My father loves her care.' },
      { caregiverId: createdCaregivers[2]._id, userName: 'Vikram Mehta', rating: 5, comment: 'Priya is highly skilled and very punctual. Highly recommend!' },
      { caregiverId: createdCaregivers[2]._id, userName: 'Sunita Desai', rating: 5, comment: 'Best nurse we have ever had. Very knowledgeable.' },
      { caregiverId: createdCaregivers[7]._id, userName: 'Amit Gupta', rating: 5, comment: 'James handled my father\'s critical condition excellently.' },
    ];

    for (const review of sampleReviews) {
      const newReview = new Review({
        ...review,
        userId: new mongoose.Types.ObjectId(),
      });
      await newReview.save();
    }

    console.log(`✓ Added ${sampleReviews.length} sample reviews`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nCreated ${createdCaregivers.length} caregivers:`);
    console.log(`- Nurses: ${createdCaregivers.filter(c => c.type === 'nurse').length}`);
    console.log(`- Companions: ${createdCaregivers.filter(c => c.type === 'companion').length}`);
    console.log(`- Physiotherapists: ${createdCaregivers.filter(c => c.type === 'physiotherapist').length}`);
    
    console.log('\n📝 Login credentials for testing:');
    console.log('Email: sarah.johnson@eldercare.com');
    console.log('Password: password123');
    console.log('(Same password for all fake caregivers)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
