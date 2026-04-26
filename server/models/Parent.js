const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  healthConditions: String,
  specialNeeds: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Parent', parentSchema);
