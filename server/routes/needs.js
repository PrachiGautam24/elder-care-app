const express = require('express');
const CaregiverNeed = require('../models/CaregiverNeed');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const needs = await CaregiverNeed.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(needs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const need = new CaregiverNeed({ ...req.body, userId: req.userId });
    await need.save();
    res.status(201).json(need);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const need = await CaregiverNeed.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!need) return res.status(404).json({ message: 'Need not found' });
    res.json({ message: 'Need deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
