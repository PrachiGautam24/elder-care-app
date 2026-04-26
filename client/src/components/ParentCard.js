import React from 'react';

const ParentCard = ({ parent, onClick }) => {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.avatar}>{parent.name.charAt(0)}</div>
      <div style={styles.info}>
        <h3 style={styles.name}>{parent.name}</h3>
        <p style={styles.details}>{parent.age} years • {parent.gender}</p>
        {parent.healthConditions && (
          <p style={styles.health}>{parent.healthConditions}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '600',
    color: '#666',
    marginRight: '16px',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  details: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  },
  health: {
    fontSize: '13px',
    color: '#999',
  },
};

export default ParentCard;
