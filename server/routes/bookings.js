const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Get bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('caregiverId parentId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.userId });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
