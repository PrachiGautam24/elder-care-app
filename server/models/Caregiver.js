const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['nurse', 'companion', 'physiotherapist'], required: true },
  experience: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  bio: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Caregiver', caregiverSchema);
