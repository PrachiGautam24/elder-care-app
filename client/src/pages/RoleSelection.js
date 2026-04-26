import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'family',
      icon: '👨‍👩‍👧',
      title: 'Family Member',
      description: 'Find caregivers for your loved ones',
      path: '/login',
    },
    {
      id: 'caregiver',
      icon: '👩‍⚕️',
      title: 'Caregiver',
      description: 'Provide care services and earn',
      path: '/caregiver/register',
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>I am a...</h1>
      <p style={styles.subtitle}>Select your role to continue</p>

      <div style={styles.roleContainer}>
        {roles.map((role) => (
          <div key={role.id} style={styles.roleCard} onClick={() => navigate(role.path)}>
            <div style={styles.icon}>{role.icon}</div>
            <h3 style={styles.roleTitle}>{role.title}</h3>
            <p style={styles.roleDescription}>{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '40px',
  },
  roleContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '600px',
  },
  roleCard: {
    flex: '1 1 250px',
    padding: '40px 30px',
    backgroundColor: '#ffffff',
    border: '2px solid #e0e0e0',
    borderRadius: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  icon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  roleTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  roleDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
};

export default RoleSelection;
