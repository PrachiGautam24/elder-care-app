import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.logoIcon}>E</div>
      <h1 style={styles.title}>ElderEase</h1>
      <p style={styles.subtitle}>Senior Care, Simplified</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  logoIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#111111',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '18px',
    fontSize: '40px',
    fontWeight: '700',
    marginBottom: '24px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#111111',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#888',
  },
};

export default SplashScreen;
