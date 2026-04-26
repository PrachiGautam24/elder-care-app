const express = require('express');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const payment = new Payment({
      bookingId,
      userId: req.userId,
      amount: booking.totalAmount,
      method,
      status: 'completed',
    });
    await payment.save();
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();
    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
