import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: '' });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const roles = [
    { id: 'family', icon: '👨‍👩‍👧', label: 'Family Member', desc: 'Looking for care for elderly family members' },
    { id: 'nurse', icon: '👩‍⚕️', label: 'Nurse', desc: 'Registered nurse providing medical support' },
    { id: 'caregiver', icon: '🤝', label: 'Caregiver', desc: 'Providing daily care and assistance' },
    { id: 'admin', icon: '⚙️', label: 'Admin', desc: 'Platform administrator' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.role) { setError('Please select a role'); setStep(1); return; }
    try {
      await register(formData);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>E</div>
        <h1 style={styles.title}>{step === 1 ? 'Create account' : 'Your details'}</h1>
        <p style={styles.subtitle}>{step === 1 ? 'Choose your role to get started' : `Signing up as ${roles.find(r => r.id === formData.role)?.label}`}</p>

        {step === 1 ? (
          <div>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.roleGrid}>
              {roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  style={{ ...styles.roleCard, ...(formData.role === role.id ? styles.roleCardActive : {}) }}
                  onClick={() => setFormData({ ...formData, role: role.id })}
                >
                  <span style={styles.roleIcon}>{role.icon}</span>
                  <span style={styles.roleLabel}>{role.label}</span>
                  <span style={styles.roleDesc}>{role.desc}</span>
                </button>
              ))}
            </div>
            <button
              style={{ ...styles.button, opacity: formData.role ? 1 : 0.4 }}
              onClick={() => formData.role && setStep(2)}
              disabled={!formData.role}
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 000 0000' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formData[f.key]}
                  onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
            ))}
            <div style={styles.actions}>
              <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>Back</button>
              <button type="submit" style={styles.button}>Sign Up</button>
            </div>
          </form>
        )}

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '16px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  logo: {
    width: '48px',
    height: '48px',
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 auto 24px',
  },
  title: { fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: '#888', marginBottom: '28px' },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
  },
  roleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '16px 10px',
    backgroundColor: '#fafafa',
    border: '1.5px solid #e8e8e8',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  roleCardActive: {
    backgroundColor: '#f0f0f0',
    border: '1.5px solid #111',
  },
  roleIcon: { fontSize: '28px', marginBottom: '4px' },
  roleLabel: { fontSize: '13px', fontWeight: '600', color: '#111' },
  roleDesc: { fontSize: '11px', color: '#888', lineHeight: '1.4' },
  form: { textAlign: 'left' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '13px',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  backBtn: {
    flex: 1,
    padding: '13px',
    backgroundColor: 'transparent',
    color: '#111',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    cursor: 'pointer',
  },
  actions: { display: 'flex', gap: '10px', marginTop: '8px' },
  error: {
    padding: '10px 14px',
    backgroundColor: '#fff0f0',
    color: '#c00',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    border: '1px solid #ffd0d0',
    textAlign: 'left',
  },
  footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#666' },
  link: { color: '#111', fontWeight: '600' },
};

export default Signup;
