const express = require('express');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.userId });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const patient = new Patient({ ...req.body, userId: req.userId });
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
