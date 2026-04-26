const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caregiver', required: true },
  caregiverName: { type: String },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'accepted', 'rejected', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
