import React from 'react';
import RatingStars from './RatingStars';

const CaregiverCard = ({ caregiver, onClick }) => {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.avatar}>{caregiver.name.charAt(0)}</div>
      <div style={styles.info}>
        <h3 style={styles.name}>{caregiver.name}</h3>
        <p style={styles.type}>{caregiver.type}</p>
        <div style={styles.ratingRow}>
          <RatingStars rating={caregiver.rating} />
          <span style={styles.ratingText}>({caregiver.reviews || 0})</span>
        </div>
        <p style={styles.price}>₹{caregiver.pricePerHour}/hour</p>
      </div>
      <div style={styles.badge}>
        {caregiver.verified && <span style={styles.verifiedBadge}>✓ Verified</span>}
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
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
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
  type: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '6px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
  },
  ratingText: {
    fontSize: '13px',
    color: '#999',
    marginLeft: '6px',
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
  },
  verifiedBadge: {
    fontSize: '12px',
    color: '#4CAF50',
    fontWeight: '500',
  },
};

export default CaregiverCard;
