const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const parentRoutes = require('./routes/parents');
const caregiverRoutes = require('./routes/caregivers');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const needsRoutes = require('./routes/needs');
const patientsRoutes = require('./routes/patients');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/needs', needsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', bookingRoutes);
app.use('/api/earnings', caregiverRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'Elder Care API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend and Backend both accessible at http://localhost:${PORT}`);
  console.log(`\nAccess from phone: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log(`(Replace YOUR_IP_ADDRESS with your computer's IP)`);
});
