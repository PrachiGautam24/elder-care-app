const express = require('express');
const Review = require('../models/Review');
const Caregiver = require('../models/Caregiver');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for caregiver
router.get('/:caregiverId', async (req, res) => {
  try {
    const reviews = await Review.find({ caregiverId: req.params.caregiverId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { caregiverId, rating, comment } = req.body;
    const review = new Review({ caregiverId, userId: req.userId, userName: 'User', rating, comment });
    await review.save();
    
    // Update caregiver rating
    const reviews = await Review.find({ caregiverId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Caregiver.findByIdAndUpdate(caregiverId, { rating: avgRating, reviews: reviews.length });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
