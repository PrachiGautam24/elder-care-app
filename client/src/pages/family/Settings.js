import React, { useState, useContext, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';

const Settings = () => {
  const { user, updateProfile: updateAuthProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingReminders: true,
    careUpdates: true,
  });

  const handleProfileSave = async () => {
    try {
      const updated = await updateProfile(profile);
      updateAuthProfile(updated.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Unable to update profile right now. Please try again.');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <DashboardLayout title="Settings">
      {/* Profile Information */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Profile Information</h3>
        <div style={styles.card}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              style={styles.input}
            />
          </div>
          <button onClick={handleProfileSave} style={styles.saveBtn}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Notification Preferences</h3>
        <div style={styles.card}>
          <div style={styles.settingItem}>
            <div>
              <p style={styles.settingLabel}>Email Notifications</p>
              <p style={styles.settingDesc}>Receive updates via email</p>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationToggle('emailNotifications')}
              />
              <span style={styles.slider}></span>
            </label>
          </div>

          <div style={styles.settingItem}>
            <div>
              <p style={styles.settingLabel}>SMS Notifications</p>
              <p style={styles.settingDesc}>Receive updates via text message</p>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={notifications.smsNotifications}
                onChange={() => handleNotificationToggle('smsNotifications')}
              />
              <span style={styles.slider}></span>
            </label>
          </div>

          <div style={styles.settingItem}>
            <div>
              <p style={styles.settingLabel}>Booking Reminders</p>
              <p style={styles.settingDesc}>Get reminders for upcoming bookings</p>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={notifications.bookingReminders}
                onChange={() => handleNotificationToggle('bookingReminders')}
              />
              <span style={styles.slider}></span>
            </label>
          </div>

          <div style={styles.settingItem}>
            <div>
              <p style={styles.settingLabel}>Care Updates</p>
              <p style={styles.settingDesc}>Real-time updates during care sessions</p>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={notifications.careUpdates}
                onChange={() => handleNotificationToggle('careUpdates')}
              />
              <span style={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Payment Methods</h3>
        <div style={styles.card}>
          <div style={styles.paymentCard}>
            <div style={styles.cardIcon}>💳</div>
            <div style={styles.cardInfo}>
              <p style={styles.cardType}>Visa ending in 4242</p>
              <p style={styles.cardExpiry}>Expires 12/25</p>
            </div>
            <button style={styles.removeBtn}>Remove</button>
          </div>
          <button style={styles.addPaymentBtn}>+ Add Payment Method</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
  },
  saveBtn: {
    padding: '12px 24px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  settingLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  settingDesc: {
    fontSize: '13px',
    color: '#666',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '24px',
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    borderRadius: '24px',
    transition: '0.4s',
  },
  paymentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  cardIcon: {
    fontSize: '32px',
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  cardExpiry: {
    fontSize: '13px',
    color: '#666',
  },
  removeBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#d32f2f',
    border: '1px solid #d32f2f',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  addPaymentBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default Settings;
