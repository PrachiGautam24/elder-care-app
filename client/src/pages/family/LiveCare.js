import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getBookings } from '../../services/api';

const LiveCare = () => {
  const location = useLocation();
  const [activeBooking, setActiveBooking] = useState(location.state?.booking || null);
  const [updates] = useState([
    { icon: '💊', title: 'Medication taken', subtitle: 'Vitamin D - 10:00 AM', time: '10:00 AM', done: true },
    { icon: '🚶', title: 'Movement detected', subtitle: 'Light activity in living room', time: '09:45 AM', done: false },
    { icon: '😴', title: 'Sleeping', subtitle: 'Night sleep started', time: '10:30 PM', done: false },
  ]);

  useEffect(() => {
    if (!activeBooking) {
      getBookings().then(({ data }) => {
        const active = data.find(b => b.status === 'confirmed');
        setActiveBooking(active);
      }).catch(err => console.error('Error:', err));
    }
  }, []);

  return (
    <DashboardLayout>
      <div style={s.page}>
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.signalIcon}>
              <span style={s.signalBar1} /><span style={s.signalBar2} /><span style={s.signalBar3} />
            </div>
            <div>
              <h1 style={s.title}>((·)) Live Care</h1>
              <p style={s.subtitle}>Real-time monitoring and care</p>
            </div>
          </div>
          <button style={s.menuBtn}>···</button>
        </div>

        <div style={s.twoCol}>
          <div style={s.videoArea}>
            <div style={s.liveBadge}><span style={s.liveDot} />Live</div>
            <div style={s.videoPlaceholder}>
              <span style={s.cameraIcon}>📷</span>
              <p style={s.cameraLabel}>Camera Feed</p>
            </div>
            <button style={s.fullscreenBtn}>⛶</button>
          </div>

          <div style={s.rightCol}>
            <div style={s.statusCard}>
              <p style={s.statusLabel}>Status</p>
              <div style={s.statusRow}>
                <span style={s.connectedDot} />
                <span style={s.connectedText}>Connected</span>
              </div>
              <p style={s.statusSub}>Everything is normal</p>
            </div>

            <div style={s.metricsRow}>
              <div style={s.metricCard}>
                <span style={s.metricIcon}>♡</span>
                <p style={s.metricLabel}>Heart Rate</p>
                <p style={s.metricVal}>72</p>
                <p style={s.metricUnit}>bpm</p>
              </div>
              <div style={s.metricCard}>
                <span style={s.metricIcon}>🫀</span>
                <p style={s.metricLabel}>Blood Pressure</p>
                <p style={s.metricVal}>120/80</p>
                <p style={s.metricUnit}>mmHg</p>
              </div>
              <div style={s.metricCard}>
                <span style={s.metricIcon}>🫁</span>
                <p style={s.metricLabel}>Oxygen Level</p>
                <p style={s.metricVal}>98%</p>
                <p style={s.metricUnit}>SpO2</p>
              </div>
            </div>

            <button style={s.emergencyBtn}>▲ Call Emergency</button>
          </div>
        </div>

        <div style={s.feedSection}>
          <p style={s.feedTitle}>Activity Feed</p>
          <div style={s.feedList}>
            {updates.map((item, i) => (
              <div key={i} style={s.feedItem}>
                <div style={s.feedIconCircle}>{item.icon}</div>
                <div style={s.feedContent}>
                  <p style={s.feedItemTitle}>{item.title}</p>
                  <p style={s.feedItemSub}>{item.subtitle}</p>
                </div>
                <div style={s.feedRight}>
                  <span style={s.feedTime}>{item.time}</span>
                  {item.done && <span style={s.feedCheck}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!activeBooking && (
          <div style={s.noBookingBanner}>
            <span>📱</span>
            <span style={{ marginLeft: 8 }}>No active care session — showing demo data</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const s = {
  page: { padding: '4px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: '16px 24px', marginBottom: 20, border: '1px solid #e8e8e8' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  signalIcon: { display: 'flex', gap: 3, alignItems: 'flex-end' },
  signalBar1: { width: 4, height: 8, backgroundColor: '#111', borderRadius: 2, display: 'inline-block' },
  signalBar2: { width: 4, height: 12, backgroundColor: '#111', borderRadius: 2, display: 'inline-block' },
  signalBar3: { width: 4, height: 16, backgroundColor: '#111', borderRadius: 2, display: 'inline-block' },
  title: { fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 2 },
  subtitle: { fontSize: 12, color: '#888' },
  menuBtn: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', letterSpacing: 2 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, marginBottom: 20 },
  videoArea: { backgroundColor: '#1a1a1a', borderRadius: 16, position: 'relative', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  liveBadge: { position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 20 },
  liveDot: { width: 8, height: 8, borderRadius: '50%', backgroundColor: '#e00', display: 'inline-block' },
  videoPlaceholder: { textAlign: 'center' },
  cameraIcon: { fontSize: 48, display: 'block', marginBottom: 8 },
  cameraLabel: { fontSize: 14, color: '#888' },
  fullscreenBtn: { position: 'absolute', bottom: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 18, borderRadius: 8, padding: '6px 10px', cursor: 'pointer' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  statusCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '16px 18px' },
  statusLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  connectedDot: { width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' },
  connectedText: { fontSize: 15, fontWeight: 700, color: '#111' },
  statusSub: { fontSize: 12, color: '#888' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  metricCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '14px 10px', textAlign: 'center' },
  metricIcon: { fontSize: 20, display: 'block', marginBottom: 4 },
  metricLabel: { fontSize: 10, color: '#888', marginBottom: 4 },
  metricVal: { fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 2 },
  metricUnit: { fontSize: 10, color: '#aaa' },
  emergencyBtn: { width: '100%', padding: 14, backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  feedSection: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '20px 24px' },
  feedTitle: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 },
  feedList: { display: 'flex', flexDirection: 'column', gap: 0 },
  feedItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  feedIconCircle: { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  feedContent: { flex: 1 },
  feedItemTitle: { fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 },
  feedItemSub: { fontSize: 12, color: '#888' },
  feedRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  feedTime: { fontSize: 12, color: '#aaa' },
  feedCheck: { width: 20, height: 20, borderRadius: '50%', backgroundColor: '#111', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  noBookingBanner: { marginTop: 16, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#888', textAlign: 'center' },
};

export default LiveCare;
