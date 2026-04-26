import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getParents, createBooking } from '../../services/api';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const caregiver = location.state?.caregiver;
  const hourlyRate = caregiver?.pricePerHour ?? caregiver?.price ?? caregiver?.hourlyRate ?? 0;
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    parentId: '',
    date: '',
    hours: '',
  });

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const { data } = await getParents();
      if (Array.isArray(data) && data.length > 0) {
        setParents(data);
        return;
      }
    } catch (err) {
      console.error('Error fetching parents from API:', err);
    }

    const localParents = JSON.parse(localStorage.getItem('myParents') || '[]');
    setParents(localParents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hourlyRate = caregiver.pricePerHour ?? caregiver.price ?? caregiver.hourlyRate ?? 0;
    const caregId = caregiver._id || caregiver.id;

    const bookingData = {
      parentId: formData.parentId,
      caregiverId: caregId,
      caregiverName: caregiver.name,
      date: formData.date,
      hours: Number(formData.hours),
      totalAmount: Number(formData.hours) * hourlyRate,
      status: 'pending',
      paymentStatus: 'unpaid',
    };

    try {
      const response = await createBooking(bookingData);
      const savedBooking = response.data;

      // Also persist to localStorage for offline / immediate lookup
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([savedBooking, ...existingBookings]));

      navigate('/family/payment', { state: { booking: savedBooking, caregiver: { ...caregiver, pricePerHour: hourlyRate } } });
    } catch (err) {
      console.error('Error creating booking:', err);
      const fallback = JSON.parse(localStorage.getItem('bookings') || '[]');
      const localBooking = { ...bookingData, _id: `local-${Date.now()}`, status: 'pending', paymentStatus: 'unpaid' };
      localStorage.setItem('bookings', JSON.stringify([localBooking, ...fallback]));
      navigate('/family/payment', { state: { booking: localBooking, caregiver: { ...caregiver, pricePerHour: hourlyRate } } });
    }
  };

  if (!caregiver) {
    return <div>No caregiver selected</div>;
  }

  return (
    <DashboardLayout title="Book Caregiver">
      <div style={styles.caregiverInfo}>
        <h3 style={styles.caregiverName}>{caregiver.name}</h3>
        <p style={styles.caregiverType}>{caregiver.type}</p>
        <p style={styles.price}>₹{hourlyRate}/hour</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Parent</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              style={styles.input}
              required
            >
              <option value="">Choose parent</option>
              {parents.map((parent) => (
                <option key={parent._id || parent.id} value={parent._id || parent.id}>
                  {parent.name} {parent.relationship ? `(${parent.relationship})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={styles.input}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Hours</label>
            <input
              type="number"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              style={styles.input}
              min="1"
              placeholder="Number of hours"
              required
            />
          </div>

          {formData.hours && (
            <div style={styles.totalSection}>
              <span style={styles.totalLabel}>Total Amount:</span>
              <span style={styles.totalAmount}>₹{hourlyRate * Number(formData.hours)}</span>
            </div>
          )}

        <button type="submit" style={styles.submitBtn}>Proceed to Payment</button>
      </form>
    </DashboardLayout>
  );
};

const styles = {
  caregiverInfo: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
    textAlign: 'center',
  },
  caregiverName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  caregiverType: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  price: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
  totalAmount: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#333',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
  },
};

export default Booking;
