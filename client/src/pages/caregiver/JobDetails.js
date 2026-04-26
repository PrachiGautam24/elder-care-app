import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { updateBooking } from '../../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    parentName: 'John Doe',
    age: 75,
    healthConditions: 'Diabetes, High BP',
    date: '2024-03-20',
    hours: 8,
    totalAmount: 2000,
    status: 'pending',
  });

  const handleAccept = async () => {
    try {
      await updateBooking(id, { status: 'accepted' });
      alert('Job accepted!');
      navigate('/caregiver/dashboard');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleReject = async () => {
    try {
      await updateBooking(id, { status: 'rejected' });
      alert('Job rejected');
      navigate('/caregiver/dashboard');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar title="Job Details" />
      
      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.title}>Patient Information</h3>
          <div style={styles.row}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{job.parentName}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Age:</span>
            <span style={styles.value}>{job.age} years</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Health:</span>
            <span style={styles.value}>{job.healthConditions}</span>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.title}>Job Details</h3>
          <div style={styles.row}>
            <span style={styles.label}>Date:</span>
            <span style={styles.value}>{job.date}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Duration:</span>
            <span style={styles.value}>{job.hours} hours</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Payment:</span>
            <span style={styles.value}>₹{job.totalAmount}</span>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={handleAccept} style={styles.acceptBtn}>Accept Job</button>
          <button onClick={handleReject} style={styles.rejectBtn}>Reject</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#fafafa' },
  content: { padding: '20px' },
  card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '16px' },
  title: { fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  label: { fontSize: '14px', color: '#666' },
  value: { fontSize: '14px', fontWeight: '500', color: '#333' },
  actions: { display: 'flex', gap: '12px' },
  acceptBtn: { flex: 1, padding: '14px', backgroundColor: '#333', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '12px' },
  rejectBtn: { flex: 1, padding: '14px', backgroundColor: '#f5f5f5', color: '#333', fontSize: '16px', fontWeight: '600', borderRadius: '12px' },
};

export default JobDetails;
