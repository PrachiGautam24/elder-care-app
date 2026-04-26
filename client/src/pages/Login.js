import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginAPI(formData);
      login(data.user, data.token);
      const role = data.user.role;
      switch(role) {
        case 'nurse': navigate('/nurse/dashboard'); break;
        case 'caregiver': navigate('/caregiver/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/family/dashboard'); break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>E</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to ElderEase</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Sign In</button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
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
    maxWidth: '400px',
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
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '32px',
  },
  form: { textAlign: 'left' },
  field: { marginBottom: '18px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px',
  },
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
    marginTop: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    padding: '10px 14px',
    backgroundColor: '#fff0f0',
    color: '#c00',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    border: '1px solid #ffd0d0',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#111',
    fontWeight: '600',
  },
};

export default Login;
