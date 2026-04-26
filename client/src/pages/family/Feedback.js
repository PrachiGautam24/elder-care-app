import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { createReview } from '../../services/api';

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { caregiverId } = location.state || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({ caregiverId, rating, comment });
      navigate('/family/dashboard');
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  return (
    <DashboardLayout title="Feedback">
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.title}>Rate Your Experience</h3>
        
        <div style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ ...styles.star, color: star <= rating ? '#FFB800' : '#e0e0e0' }}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.textarea}
          placeholder="Share your experience..."
          required
        />

        <button type="submit" style={styles.submitBtn}>Submit Feedback</button>
      </form>
    </DashboardLayout>
  );
};

const styles = {
  form: { backgroundColor: '#ffffff', padding: '30px 20px', borderRadius: '12px', border: '1px solid #e0e0e0' },
  title: { fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '24px', textAlign: 'center' },
  starsContainer: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' },
  star: { fontSize: '40px', cursor: 'pointer' },
  textarea: { width: '100%', minHeight: '120px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', marginBottom: '20px' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#333', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '8px' },
};

export default Feedback;
