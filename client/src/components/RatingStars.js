import React from 'react';

const RatingStars = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ ...styles.star, fontSize: size, color: i <= rating ? '#FFB800' : '#e0e0e0' }}>
        ★
      </span>
    );
  }
  return <div style={styles.container}>{stars}</div>;
};

const styles = {
  container: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    lineHeight: 1,
  },
};

export default RatingStars;
