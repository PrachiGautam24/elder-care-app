import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '👨‍👩‍👧',
      title: 'Find Trusted Caregivers',
      description: 'Connect with verified and experienced caregivers for your elderly loved ones',
    },
    {
      icon: '📱',
      title: 'Real-Time Monitoring',
      description: 'Stay updated with live care updates and communicate seamlessly',
    },
    {
      icon: '⭐',
      title: 'Quality Assured',
      description: 'All caregivers are background-verified and rated by families',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.slideContainer}>
        <div style={styles.icon}>{slides[currentSlide].icon}</div>
        <h2 style={styles.title}>{slides[currentSlide].title}</h2>
        <p style={styles.description}>{slides[currentSlide].description}</p>
      </div>

      <div style={styles.dots}>
        {slides.map((_, index) => (
          <div key={index} style={{ ...styles.dot, backgroundColor: index === currentSlide ? '#333' : '#e0e0e0' }} />
        ))}
      </div>

      <button onClick={handleNext} style={styles.button}>
        {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    padding: '40px 20px',
    backgroundColor: '#ffffff',
  },
  slideContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    fontSize: '100px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    maxWidth: '350px',
  },
  dots: {
    display: 'flex',
    gap: '8px',
    marginBottom: '30px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  button: {
    width: '100%',
    maxWidth: '400px',
    padding: '16px',
    backgroundColor: '#333',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '12px',
  },
};

export default Onboarding;
