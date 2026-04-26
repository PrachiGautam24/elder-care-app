import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getBookings } from '../../services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const Bookings = () => {
  const location = useLocation();
  const passedCaregiver = location.state?.caregiver || null;
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [bookings, setBookings] = useState([]);

  const selectedCaregiver = passedCaregiver || { name: 'Rita Sharma', specialization: 'Elderly Care & Medication Support', experience: 5, rating: 4.5, price: 250 };

  useEffect(() => {
    getBookings().then(({ data }) => setBookings(data)).catch(err => {
      const local = JSON.parse(localStorage.getItem('bookings') || '[]');
      setBookings(local.map((b, i) => ({ _id: b._id || `local-${i}`, ...b })));
    });
  }, []);

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); } else setSelectedMonth(m => m - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); } else setSelectedMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDay(selectedMonth, selectedYear);
  const calCells = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

  const duration = 2;
  const total = selectedCaregiver.price * duration;
  const renderStars = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));

  return (
    <DashboardLayout>
      <div style={s.page}>
        <div style={s.header}>
          <h1 style={s.title}>📅 Booking</h1>
          <p style={s.subtitle}>Book services and appointments</p>
        </div>

        <div style={s.twoCol}>
          <div style={s.leftCol}>
            <div style={s.card}>
              <p style={s.cardTitle}>Select Date</p>
              <div style={s.calNav}>
                <button style={s.navBtn} onClick={prevMonth}>‹</button>
                <span style={s.calMonthYear}>{MONTHS[selectedMonth]} {selectedYear}</span>
                <button style={s.navBtn} onClick={nextMonth}>›</button>
              </div>
              <div style={s.calGrid}>
                {DAYS.map(d => <div key={d} style={s.calDayHeader}>{d}</div>)}
                {calCells.map((day, i) => (
                  <div key={i}
                    style={day === null ? s.calEmpty : day === selectedDate ? s.calDaySelected : s.calDay}
                    onClick={() => day && setSelectedDate(day)}
                  >{day || ''}</div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <p style={s.cardTitle}>Selected Caregiver</p>
              <div style={s.cgRow}>
                <div style={s.cgAvatar}>{selectedCaregiver.name.charAt(0)}</div>
                <div style={s.cgInfo}>
                  <div style={s.cgNameRow}>
                    <span style={s.cgName}>{selectedCaregiver.name}</span>
                    <span style={s.verifiedBadge}>✓</span>
                    <span style={s.cgPrice}>₹{selectedCaregiver.price}/hr</span>
                  </div>
                  <p style={s.cgSpec}>{selectedCaregiver.specialization} · {selectedCaregiver.experience}+ yrs</p>
                  <p style={s.cgRating}>{renderStars(selectedCaregiver.rating)} {selectedCaregiver.rating}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={s.rightCol}>
            <div style={s.card}>
              <p style={s.cardTitle}>Select Time</p>
              <div style={s.timeGrid}>
                {TIME_SLOTS.map(slot => (
                  <button key={slot} style={selectedTime === slot ? s.timeSlotSelected : s.timeSlot} onClick={() => setSelectedTime(slot)}>{slot}</button>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <p style={s.cardTitle}>Booking Summary</p>
              <div style={s.summaryRows}>
                {[
                  { label: 'Service', val: selectedCaregiver.specialization },
                  { label: 'Date', val: `${selectedDate} ${MONTHS[selectedMonth]} ${selectedYear}` },
                  { label: 'Time', val: selectedTime },
                  { label: 'Duration', val: `${duration} Hour` },
                ].map(row => (
                  <div key={row.label} style={s.summaryRow}>
                    <span style={s.summaryLabel}>{row.label}</span>
                    <span style={s.summaryVal}>{row.val}</span>
                  </div>
                ))}
                <div style={s.summaryDivider} />
                <div style={s.summaryRow}>
                  <span style={s.totalLabel}>Total</span>
                  <span style={s.totalVal}>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button style={s.confirmBtn}>Confirm Booking</button>

        {bookings.length > 0 && (
          <div style={s.existingSection}>
            <p style={s.existingTitle}>Your Bookings</p>
            {bookings.slice(0, 3).map(booking => (
              <div key={booking._id} style={s.bookingRow}>
                <div>
                  <p style={s.bookingName}>{booking.caregiverName || booking.caregiverId?.name || 'Caregiver'}</p>
                  <p style={s.bookingDate}>{booking.date ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}</p>
                </div>
                <span style={{ ...s.statusBadge, backgroundColor: booking.status === 'confirmed' ? '#f0fdf4' : booking.status === 'completed' ? '#eff6ff' : '#fffbeb', color: booking.status === 'confirmed' ? '#16a34a' : booking.status === 'completed' ? '#2563eb' : '#d97706' }}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const s = {
  page: { padding: '4px 0' },
  header: { backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 20, border: '1px solid #e8e8e8' },
  title: { fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 },
  calNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { background: 'none', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 18, cursor: 'pointer', padding: '4px 10px', color: '#111' },
  calMonthYear: { fontSize: 14, fontWeight: 600, color: '#111' },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 },
  calDayHeader: { textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#aaa', padding: '4px 0' },
  calDay: { textAlign: 'center', fontSize: 13, color: '#111', padding: '8px 4px', borderRadius: 8, cursor: 'pointer' },
  calDaySelected: { textAlign: 'center', fontSize: 13, color: '#fff', padding: '8px 4px', borderRadius: '50%', cursor: 'pointer', backgroundColor: '#111', fontWeight: 700 },
  calEmpty: { padding: '8px 4px' },
  cgRow: { display: 'flex', gap: 14, alignItems: 'center' },
  cgAvatar: { width: 52, height: 52, borderRadius: '50%', backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#555', flexShrink: 0 },
  cgInfo: { flex: 1 },
  cgNameRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 },
  cgName: { fontSize: 15, fontWeight: 700, color: '#111' },
  verifiedBadge: { width: 18, height: 18, borderRadius: '50%', backgroundColor: '#111', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cgPrice: { fontSize: 14, fontWeight: 700, color: '#111', marginLeft: 'auto' },
  cgSpec: { fontSize: 12, color: '#666', marginBottom: 3 },
  cgRating: { fontSize: 12, color: '#f5a623' },
  timeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  timeSlot: { padding: '10px 6px', backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 10, fontSize: 12, fontWeight: 500, color: '#111', cursor: 'pointer', textAlign: 'center' },
  timeSlotSelected: { padding: '10px 6px', backgroundColor: '#111', border: '1px solid #111', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', textAlign: 'center' },
  summaryRows: { display: 'flex', flexDirection: 'column' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryVal: { fontSize: 13, fontWeight: 500, color: '#111', textAlign: 'right', maxWidth: '60%' },
  summaryDivider: { height: 1, backgroundColor: '#e8e8e8', margin: '4px 0' },
  totalLabel: { fontSize: 14, fontWeight: 700, color: '#111' },
  totalVal: { fontSize: 16, fontWeight: 800, color: '#111' },
  confirmBtn: { width: '100%', padding: 16, backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 24 },
  existingSection: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: 20 },
  existingTitle: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 14 },
  bookingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  bookingName: { fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 3 },
  bookingDate: { fontSize: 12, color: '#888' },
  statusBadge: { padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
};

export default Bookings;
