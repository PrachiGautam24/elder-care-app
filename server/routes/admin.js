const express = require('express');
const User = require('../models/User');
const Caregiver = require('../models/Caregiver');
const auth = require('../middleware/auth');

const router = express.Router();

// Get admin stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCaregivers = await Caregiver.countDocuments();
    const pendingVerifications = await Caregiver.find({ verificationStatus: 'pending' });
    res.json({ totalUsers, totalCaregivers, pendingVerifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify caregiver
router.put('/verify/:id', auth, async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'approved', verified: true },
      { new: true }
    );
    res.json({ message: 'Caregiver verified', caregiver });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
