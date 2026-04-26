import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const [showAddCareForm, setShowAddCareForm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [careItems, setCareItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [careForm, setCareForm] = useState({
    type: 'medication', priority: 'high', title: '', description: '',
    date: new Date().toISOString().split('T')[0], time: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myParents') || '[]');
    setParents(saved);
    if (saved.length > 0) setSelectedParent(saved[0].name);
  }, []);

  const handleAddCareItem = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), ...careForm, parent: selectedParent, completed: false, createdAt: new Date().toLocaleString() };
    setCareItems([...careItems, newItem]);
    setShowAddCareForm(false);
    setCareForm({ type: 'medication', priority: 'high', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '' });
  };

  const toggleCareItem = (id) => setCareItems(careItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const deleteCareItem = (id) => setCareItems(careItems.filter(item => item.id !== id));

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const statCards = [
    { icon: '💊', value: careItems.filter(i => i.type === 'medication' && !i.completed).length, label: 'Medications Today' },
    { icon: '📅', value: careItems.filter(i => i.type === 'appointment' && !i.completed).length, label: 'Appointments' },
    { icon: '✅', value: careItems.filter(i => i.completed).length, label: 'Tasks Done' },
    { icon: '❤️', value: 'Good', label: 'Overall Status' },
  ];

  const quickActions = [
    { icon: '💊', label: 'Add Medication Reminder', type: 'medication' },
    { icon: '🏥', label: 'Schedule Doctor Visit', type: 'appointment' },
    { icon: '🏃', label: 'Add Exercise Reminder', type: 'exercise' },
    { icon: '🍽️', label: 'Add Meal Reminder', type: 'meal' },
  ];

  return (
    <DashboardLayout>
      {showEmergencyModal && (
        <div style={s.overlay} onClick={() => setShowEmergencyModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>🚨 Emergency Contacts</h2>
            <button style={s.call911Btn}>📞 Call 911</button>
            <div style={s.modalContactBox}>
              <p style={s.modalContactLabel}>Emergency Contact</p>
              <p style={s.modalContactVal}>911</p>
            </div>
            <button style={s.modalCloseBtn} onClick={() => setShowEmergencyModal(false)}>Close</button>
          </div>
        </div>
      )}

      <div style={s.page}>
        <div style={s.header}>
          <div>
            <p style={s.greeting}>{greeting}, {selectedParent || 'Family'}</p>
            <h1 style={s.title}>Family Care Manager</h1>
            <p style={s.subtitle}>Keeping loved ones safe &amp; healthy</p>
            <div style={s.viewingRow}>
              <span style={s.viewingLabel}>Viewing:</span>
              {parents.length === 0 ? (
                <span style={s.noParents}>No members — <button onClick={() => navigate('/family/my-parents')} style={s.linkBtn}>Add one</button></span>
              ) : (
                <select style={s.select} value={selectedParent} onChange={e => setSelectedParent(e.target.value)}>
                  {parents.map(p => (
                    <option key={p.id || p._id} value={p.name}>{p.name} ({p.relationship || 'Family'})</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={{ position: 'relative' }}>
              <button style={s.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
                🔔{notifications.length > 0 && <span style={s.badge}>{notifications.length}</span>}
              </button>
              {showNotifications && (
                <div style={s.notifDropdown}>
                  <p style={s.notifHeader}>Notifications</p>
                  {notifications.length === 0 ? <p style={s.notifEmpty}>No new notifications</p> :
                    notifications.map(n => (
                      <div key={n.id} style={s.notifItem}>
                        <span style={n.type === 'critical' ? s.dotRed : s.dotYellow}>●</span>
                        <div><p style={s.notifMsg}>{n.message}</p><span style={s.notifTime}>{n.time}</span></div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <button style={s.emergencyBtn} onClick={() => setShowEmergencyModal(true)}>Emergency</button>
            <div style={s.dateBox}>
              <span style={s.dateTop}>Today</span>
              <span style={s.dateBottom}>{dateStr}</span>
            </div>
          </div>
        </div>

        <div style={s.statsRow}>
          {statCards.map((card, i) => (
            <div key={i} style={s.statCard}>
              <div style={s.statIconCircle}>{card.icon}</div>
              <p style={s.statNum}>{card.value}</p>
              <p style={s.statLabel}>{card.label}</p>
              <div style={s.statWave} />
            </div>
          ))}
        </div>

        <button style={s.addCareBtn} onClick={() => setShowAddCareForm(!showAddCareForm)}>+ Add Care Item</button>

        {showAddCareForm && (
          <div style={s.formCard}>
            <form onSubmit={handleAddCareItem}>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Type</label>
                  <select style={s.formSelect} value={careForm.type} onChange={e => setCareForm({ ...careForm, type: e.target.value })}>
                    <option value="medication">💊 Medication</option>
                    <option value="appointment">📅 Appointment</option>
                    <option value="exercise">🏃 Exercise</option>
                    <option value="meal">🍽️ Meal</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Priority</label>
                  <select style={s.formSelect} value={careForm.priority} onChange={e => setCareForm({ ...careForm, priority: e.target.value })}>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Title</label>
                <input type="text" placeholder="e.g., Blood pressure medication" style={s.formInput} value={careForm.title} onChange={e => setCareForm({ ...careForm, title: e.target.value })} required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Description (optional)</label>
                <textarea placeholder="Additional notes..." style={s.formTextarea} value={careForm.description} onChange={e => setCareForm({ ...careForm, description: e.target.value })} rows="3" />
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Date</label>
                  <input type="date" style={s.formInput} value={careForm.date} onChange={e => setCareForm({ ...careForm, date: e.target.value })} required />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Time</label>
                  <input type="time" style={s.formInput} value={careForm.time} onChange={e => setCareForm({ ...careForm, time: e.target.value })} required />
                </div>
              </div>
              <div style={s.formActions}>
                <button type="submit" style={s.submitBtn}>Add Item</button>
                <button type="button" style={s.cancelBtn} onClick={() => setShowAddCareForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {careItems.filter(i => !i.completed).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={s.sectionTitle}>📋 Care Items</p>
            {careItems.filter(i => !i.completed).map(item => (
              <div key={item.id} style={s.careItemCard}>
                <input type="checkbox" checked={item.completed} onChange={() => toggleCareItem(item.id)} style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: 18 }}>{item.type === 'medication' ? '💊' : item.type === 'appointment' ? '📅' : item.type === 'exercise' ? '🏃' : '🍽️'}</span>
                <div style={{ flex: 1 }}>
                  <p style={s.careItemTitle}>{item.title}</p>
                  <p style={s.careItemMeta}>{item.date} · {item.time} · {item.parent}</p>
                </div>
                <button style={s.deleteItemBtn} onClick={() => deleteCareItem(item.id)}>🗑️</button>
              </div>
            ))}
          </div>
        )}

        <div style={s.section}>
          <p style={s.sectionTitle}>⚡ Quick Actions</p>
          <div style={s.quickActionsRow}>
            {quickActions.map((qa, i) => (
              <button key={i} style={s.qaCard} onClick={() => { setCareForm({ ...careForm, type: qa.type }); setShowAddCareForm(true); }}>
                <span style={s.qaIcon}>{qa.icon}</span>
                <span style={s.qaLabel}>{qa.label}</span>
                <span style={s.qaArrow}>→</span>
              </button>
            ))}
          </div>
        </div>

        <div style={s.section}>
          <p style={s.sectionTitle}>🚨 Emergency Info</p>
          <div style={s.emergencyCard}>
            <div style={s.emergencyItems}>
              <div style={s.emergencyItem}><span style={s.emergencyItemIcon}>📞</span><div><p style={s.emergencyItemLabel}>Emergency: 911</p><p style={s.emergencyItemSub}>Call for immediate help</p></div></div>
              <div style={s.emergencyCallCircle} onClick={() => setShowEmergencyModal(true)}><span style={{ fontSize: 28 }}>📞</span></div>
              <div style={s.emergencyItem}><span style={s.emergencyItemIcon}>🏥</span><div><p style={s.emergencyItemLabel}>Hospital</p><p style={s.emergencyItemSub}>Local Emergency Room</p></div></div>
              <div style={s.emergencyItem}><span style={s.emergencyItemIcon}>💊</span><div><p style={s.emergencyItemLabel}>Pharmacy</p><p style={s.emergencyItemSub}>Local Pharmacy</p></div></div>
            </div>
          </div>
        </div>

        <div style={s.bottomRow}>
          <div style={s.tipCard}>
            <p style={s.sectionTitle}>💡 Daily Care Tip</p>
            <p style={s.tipText}>Sleep Quality: Maintain a consistent sleep schedule. Avoid screens an hour before bedtime for better rest.</p>
          </div>
          <div style={s.completedCard}>
            <p style={s.sectionTitle}>✅ Completed Today</p>
            {careItems.filter(i => i.completed).length === 0 ? (
              <p style={s.emptyText}>No completed items yet</p>
            ) : (
              careItems.filter(i => i.completed).map(item => (
                <div key={item.id} style={s.completedItem}>
                  <span>✅</span>
                  <div><p style={s.completedTitle}>{item.title}</p><p style={s.completedMeta}>{item.date} at {item.time}</p></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const s = {
  page: { padding: '4px 0' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 },
  modal: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 32, maxWidth: 440, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, textAlign: 'center' },
  call911Btn: { width: '100%', padding: 14, backgroundColor: '#fff', color: '#111', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 16 },
  modalContactBox: { backgroundColor: '#111', borderRadius: 10, padding: 16, marginBottom: 16 },
  modalContactLabel: { fontSize: 13, color: '#aaa', marginBottom: 4 },
  modalContactVal: { fontSize: 20, fontWeight: 700, color: '#fff' },
  modalCloseBtn: { width: '100%', padding: 12, backgroundColor: 'transparent', color: '#fff', border: '1.5px solid #444', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 20, border: '1px solid #e8e8e8', flexWrap: 'wrap', gap: 16 },
  greeting: { fontSize: 13, color: '#888', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 12 },
  viewingRow: { display: 'flex', alignItems: 'center', gap: 8 },
  viewingLabel: { fontSize: 13, color: '#666', fontWeight: 500 },
  select: { padding: '6px 12px', backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#111', cursor: 'pointer' },
  noParents: { fontSize: 13, color: '#888' },
  linkBtn: { background: 'none', border: 'none', color: '#111', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  iconBtn: { position: 'relative', padding: '8px 12px', backgroundColor: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 18, cursor: 'pointer' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#111', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 5px', borderRadius: 10 },
  notifDropdown: { position: 'absolute', top: 46, right: 0, width: 280, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 1000, maxHeight: 320, overflowY: 'auto' },
  notifHeader: { fontSize: 13, fontWeight: 700, color: '#111', padding: '12px 14px', borderBottom: '1px solid #e8e8e8' },
  notifEmpty: { padding: 20, textAlign: 'center', color: '#aaa', fontSize: 13 },
  notifItem: { display: 'flex', gap: 10, padding: '10px 14px', borderBottom: '1px solid #f0f0f0' },
  dotRed: { color: '#e00', fontSize: 10 },
  dotYellow: { color: '#f90', fontSize: 10 },
  notifMsg: { fontSize: 13, color: '#333', marginBottom: 2 },
  notifTime: { fontSize: 11, color: '#aaa' },
  emergencyBtn: { padding: '9px 18px', backgroundColor: '#fff', border: '1.5px solid #111', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  dateBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  dateTop: { fontSize: 11, color: '#aaa' },
  dateBottom: { fontSize: 13, fontWeight: 600, color: '#111' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 },
  statCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '20px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  statIconCircle: { width: 48, height: 48, borderRadius: '50%', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 10px' },
  statNum: { fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#888' },
  statWave: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #e8e8e8 0%, #ccc 50%, #e8e8e8 100%)', borderRadius: '0 0 14px 14px' },
  addCareBtn: { width: '100%', padding: 14, backgroundColor: '#fff', color: '#111', border: '1.5px dashed #ccc', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 20 },
  formCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20, marginBottom: 20 },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 },
  formGroup: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6 },
  formSelect: { width: '100%', padding: '9px 12px', backgroundColor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#111' },
  formInput: { width: '100%', padding: '9px 12px', backgroundColor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#111', boxSizing: 'border-box' },
  formTextarea: { width: '100%', padding: '9px 12px', backgroundColor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#111', resize: 'vertical', boxSizing: 'border-box' },
  formActions: { display: 'flex', gap: 10, marginTop: 14 },
  submitBtn: { flex: 1, padding: 11, backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: 11, backgroundColor: 'transparent', color: '#111', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  careItemCard: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '12px 14px', marginBottom: 8 },
  careItemTitle: { fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 },
  careItemMeta: { fontSize: 12, color: '#aaa' },
  deleteItemBtn: { background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#bbb' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 },
  quickActionsRow: { display: 'flex', flexDirection: 'column', gap: 10 },
  qaCard: { display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', textAlign: 'left' },
  qaIcon: { fontSize: 22, flexShrink: 0 },
  qaLabel: { flex: 1, fontSize: 14, fontWeight: 500, color: '#111' },
  qaArrow: { width: 30, height: 30, borderRadius: '50%', backgroundColor: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  emergencyCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '20px 24px' },
  emergencyItems: { display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 16, flexWrap: 'wrap' },
  emergencyItem: { display: 'flex', alignItems: 'center', gap: 10 },
  emergencyItemIcon: { fontSize: 22 },
  emergencyItemLabel: { fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 2 },
  emergencyItemSub: { fontSize: 11, color: '#888' },
  emergencyCallCircle: { width: 64, height: 64, borderRadius: '50%', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  bottomRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  tipCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 20 },
  tipText: { fontSize: 13, color: '#444', lineHeight: 1.6 },
  completedCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 20 },
  completedItem: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 },
  completedTitle: { fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 },
  completedMeta: { fontSize: 12, color: '#888' },
  emptyText: { fontSize: 13, color: '#aaa', textAlign: 'center', padding: '20px 0' },
};

export default FamilyDashboard;
