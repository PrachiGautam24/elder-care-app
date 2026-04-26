const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, name: req.body.name, role: req.body.role });
    const { name, email, password, phone, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone,
      role: role || 'family' // Default to family if no role provided
    });
    await user.save();
    
    console.log('User registered successfully:', email, 'Role:', user.role);
    res.status(201).json({ message: 'User registered successfully', role: user.role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Login successful:', email, 'Role:', user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update logged in user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
