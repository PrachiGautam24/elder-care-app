import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Common Pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelection from './pages/RoleSelection';

// Family Pages
import FamilyDashboard from './pages/family/Dashboard';
import MyParents from './pages/family/MyParents';
import AddParent from './pages/family/AddParent';
import SearchCaregiver from './pages/family/SearchCaregiver';
import CaregiverProfile from './pages/family/CaregiverProfile';
import AIAssistant from './pages/family/AIAssistant';
import Booking from './pages/family/Booking';
import Payment from './pages/family/Payment';
import LiveCare from './pages/family/LiveCare';
import Bookings from './pages/family/Bookings';
import Settings from './pages/family/Settings';
import Feedback from './pages/family/Feedback';

// Caregiver Pages
import CaregiverRegister from './pages/caregiver/Register';
import CaregiverDashboard from './pages/caregiver/Dashboard';
import JobDetails from './pages/caregiver/JobDetails';
import Earnings from './pages/caregiver/Earnings';

// Nurse Pages
import NurseDashboard from './pages/nurse/Dashboard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role-select" element={<RoleSelection />} />

          {/* Family Routes */}
          <Route path="/family/dashboard" element={<ProtectedRoute role="family"><FamilyDashboard /></ProtectedRoute>} />
          <Route path="/family/my-parents" element={<ProtectedRoute role="family"><MyParents /></ProtectedRoute>} />
          <Route path="/family/add-parent" element={<ProtectedRoute role="family"><AddParent /></ProtectedRoute>} />
          <Route path="/family/search" element={<ProtectedRoute role="family"><SearchCaregiver /></ProtectedRoute>} />
          <Route path="/family/profile/:id" element={<ProtectedRoute role="family"><CaregiverProfile /></ProtectedRoute>} />
          <Route path="/family/ai-assistant" element={<ProtectedRoute role="family"><AIAssistant /></ProtectedRoute>} />
          <Route path="/family/booking" element={<ProtectedRoute role="family"><Booking /></ProtectedRoute>} />
          <Route path="/family/payment" element={<ProtectedRoute role="family"><Payment /></ProtectedRoute>} />
          <Route path="/family/live-care" element={<ProtectedRoute role="family"><LiveCare /></ProtectedRoute>} />
          <Route path="/family/bookings" element={<ProtectedRoute role="family"><Bookings /></ProtectedRoute>} />
          <Route path="/family/settings" element={<ProtectedRoute role="family"><Settings /></ProtectedRoute>} />
          <Route path="/family/feedback" element={<ProtectedRoute role="family"><Feedback /></ProtectedRoute>} />

          {/* Caregiver Routes */}
          <Route path="/caregiver/register" element={<CaregiverRegister />} />
          <Route path="/caregiver/dashboard" element={<ProtectedRoute role="caregiver"><CaregiverDashboard /></ProtectedRoute>} />
          <Route path="/caregiver/job/:id" element={<ProtectedRoute role="caregiver"><JobDetails /></ProtectedRoute>} />
          <Route path="/caregiver/earnings" element={<ProtectedRoute role="caregiver"><Earnings /></ProtectedRoute>} />

          {/* Nurse Routes */}
          <Route path="/nurse/dashboard" element={<ProtectedRoute role="nurse"><NurseDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
