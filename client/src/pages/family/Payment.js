import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { createPayment } from '../../services/api';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, caregiver } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = async () => {
    try {
      await createPayment({ bookingId: booking._id, method: paymentMethod });
    } catch (err) {
      console.error('Payment API error:', err);
    }

    // Update local booking status in localStorage for immediate visibility in bookings section
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = localBookings.map((b) => {
      if ((booking._id && b._id === booking._id) || (!booking._id && b.id === booking.id)) {
        return {
          ...b,
          status: 'confirmed',
          paymentStatus: 'paid',
          confirmedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Redirect to find caregiver (family search) as requested
    navigate('/family/search');
  };

  if (!booking) return <div>No booking data</div>;

  return (
    <DashboardLayout title="Payment">
      <div style={styles.paymentSteps}>
        <h3 style={styles.stepsTitle}>Payment Procedure</h3>
        <ol style={styles.stepsList}>
          <li>Select the caregiver and request booking</li>
          <li>Review the summary and choose payment method</li>
          <li>Complete payment and confirm booking</li>
          <li>Go to Bookings to track status</li>
        </ol>
      </div>

      <div style={styles.summary}>
        <h3 style={styles.summaryTitle}>Booking Summary</h3>
        <div style={styles.summaryRow}>
          <span>Caregiver:</span>
          <span>{caregiver?.name}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Hours:</span>
          <span>{booking.hours}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Rate:</span>
          <span>₹{caregiver?.pricePerHour ?? caregiver?.price ?? caregiver?.hourlyRate}/hr</span>
        </div>
        <div style={{ ...styles.summaryRow, ...styles.total }}>
          <span>Total:</span>
          <span>₹{booking.totalAmount}</span>
        </div>
      </div>

      <div style={styles.paymentMethods}>
        <h3 style={styles.sectionTitle}>Payment Method</h3>
        {['card', 'upi', 'wallet'].map((method) => (
          <div
            key={method}
            style={{ ...styles.methodCard, border: paymentMethod === method ? '2px solid #333' : '1px solid #e0e0e0' }}
            onClick={() => setPaymentMethod(method)}
          >
            <span style={styles.methodText}>{method.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <button onClick={handlePayment} style={styles.payBtn}>Pay ₹{booking.totalAmount}</button>
    </DashboardLayout>
  );
};

const styles = {
  summary: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e0e0e0' },
  summaryTitle: { fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px', color: '#666' },
  total: { borderTop: '1px solid #e0e0e0', marginTop: '10px', paddingTop: '16px', fontSize: '18px', fontWeight: '600', color: '#333' },
  paymentMethods: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e0e0e0' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' },
  methodCard: { padding: '16px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' },
  methodText: { fontSize: '14px', fontWeight: '500', color: '#333' },
  payBtn: { width: '100%', padding: '16px', backgroundColor: '#333', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '12px' },
};

export default Payment;
