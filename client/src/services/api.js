import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Parent APIs
export const getParents = () => API.get('/parents');
export const addParent = (data) => API.post('/parents', data);
export const deleteParent = (id) => API.delete(`/parents/${id}`);

// Caregiver APIs
export const getCaregivers = (params) => API.get('/caregivers', { params });
export const getCaregiverById = (id) => API.get(`/caregivers/${id}`);
export const registerCaregiver = (data) => API.post('/caregivers/register', data);

// Booking APIs
export const getBookings = () => API.get('/bookings');
export const createBooking = (data) => API.post('/bookings', data);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);

// Caregiver Needs APIs
export const getCaregiverNeeds = () => API.get('/needs');
export const createCaregiverNeed = (data) => API.post('/needs', data);
export const deleteCaregiverNeed = (id) => API.delete(`/needs/${id}`);

// Profile APIs
export const updateProfile = (data) => API.put('/auth/profile', data);

// Payment APIs
export const createPayment = (data) => API.post('/payments', data);

// Review APIs
export const getReviews = (caregiverId) => API.get(`/reviews/${caregiverId}`);
export const createReview = (data) => API.post('/reviews', data);

// AI Assistant API
export const askAI = (data) => API.post('/ai/ask', data);

// Job APIs
export const getJobs = () => API.get('/jobs');
export const getEarnings = () => API.get('/earnings');

// Patient APIs for caregiver/nurse dashboards
export const getPatients = () => API.get('/patients');
export const createPatient = (data) => API.post('/patients', data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);

// Admin APIs
export const getAdminStats = () => API.get('/admin/stats');
export const verifyCaregiver = (id) => API.put(`/admin/verify/${id}`);

export default API;
