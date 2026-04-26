const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  condition: { type: String, required: true },
  medications: { type: String, default: '' },
  bloodPressure: String,
  sugarLevel: String,
  heartRate: String,
  weight: String,
  status: { type: String, enum: ['stable', 'critical', 'under observation'], default: 'stable' },
  assignedTo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', patientSchema);
