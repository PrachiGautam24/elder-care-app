const mongoose = require('mongoose');

const caregiverNeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careType: { type: String, required: true },
  budget: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CaregiverNeed', caregiverNeedSchema);
