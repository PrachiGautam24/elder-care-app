const express = require('express');
const Parent = require('../models/Parent');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all parents for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const parents = await Parent.find({ userId: req.userId });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add parent
router.post('/', auth, async (req, res) => {
  try {
    const parent = new Parent({ ...req.body, userId: req.userId });
    await parent.save();
    res.status(201).json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete parent
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Parent.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Parent not found' });
    res.json({ message: 'Parent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
