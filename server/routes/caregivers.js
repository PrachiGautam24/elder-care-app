const express = require('express');
const bcrypt = require('bcryptjs');
const Caregiver = require('../models/Caregiver');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all caregivers with filters
router.get('/', async (req, res) => {
  try {
    const { type, minRating } = req.query;
    const filter = { verified: true };
    if (type) filter.type = type;
    if (minRating) filter.rating = { $gte: Number(minRating) };
    const caregivers = await Caregiver.find(filter);
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get caregiver by ID
router.get('/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register caregiver
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, type, experience, pricePerHour, bio } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone, role: 'caregiver' });
    await user.save();
    const caregiver = new Caregiver({ userId: user._id, name, email, phone, type, experience, pricePerHour, bio });
    await caregiver.save();
    res.status(201).json({ message: 'Caregiver registered, awaiting verification' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get earnings
router.get('/earnings', auth, async (req, res) => {
  try {
    res.json({ total: 15000, thisMonth: 5000, transactions: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
