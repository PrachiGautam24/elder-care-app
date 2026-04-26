import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCaregiver } from '../../services/api';

const CaregiverRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    type: 'nurse',
    experience: '',
    pricePerHour: '',
    bio: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCaregiver(formData);
      alert('Registration submitted! Awaiting admin verification.');
      navigate('/login');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Caregiver Registration</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={styles.input} required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} required />
        <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={styles.input} required />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} required />
        
        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={styles.input}>
          <option value="nurse">Nurse</option>
          <option value="companion">Companion</option>
          <option value="physiotherapist">Physiotherapist</option>
        </select>
        
        <input type="number" placeholder="Years of Experience" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} style={styles.input} required />
        <input type="number" placeholder="Price per Hour (₹)" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })} style={styles.input} required />
        <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} style={{ ...styles.input, minHeight: '80px' }} />

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '20px', backgroundColor: '#ffffff' },
  title: { fontSize: '28px', fontWeight: '700', color: '#333', marginBottom: '24px', textAlign: 'center' },
  form: { maxWidth: '400px', margin: '0 auto' },
  input: { width: '100%', padding: '14px', marginBottom: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' },
  button: { width: '100%', padding: '16px', backgroundColor: '#333', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '12px', marginTop: '10px' },
};

export default CaregiverRegister;
