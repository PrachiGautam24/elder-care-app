import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = {
  root: { display: 'flex', height: '100vh', background: '#f7f7f7', fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 14 },

  // Sidebar
  sidebar: { width: 240, minWidth: 240, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 },
  sidebarTop: { padding: '24px 20px 16px', borderBottom: '1px solid #e8e8e8' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  logoBox: { width: 32, height: 32, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, borderRadius: 6 },
  logoText: { fontWeight: 700, fontSize: 15, color: '#111' },
  logoSub: { fontSize: 11, color: '#888', marginLeft: 42 },
  navList: { flex: 1, padding: '12px 12px', overflowY: 'auto' },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
    cursor: 'pointer', marginBottom: 2, color: active ? '#fff' : '#444',
    background: active ? '#111' : 'transparent', fontWeight: active ? 600 : 400,
    transition: 'background 0.15s',
  }),
  navIcon: { fontSize: 15, width: 18, textAlign: 'center' },
  sidebarBottom: { padding: '12px', borderTop: '1px solid #e8e8e8' },

  // Main
  main: { marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto' },
  topbar: { background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 },
  topbarLeft: {},
  topbarTitle: { fontWeight: 700, fontSize: 20, color: '#111', margin: 0 },
  topbarSub: { color: '#888', fontSize: 13, marginTop: 2 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  bellWrap: { position: 'relative', cursor: 'pointer' },
  bellIcon: { fontSize: 20, color: '#444' },
  bellBadge: { position: 'absolute', top: -4, right: -4, background: '#111', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  logoutBtn: { background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 },

  content: { padding: '28px', flex: 1 },

  // Stat cards
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 22px' },
  statIcon: { fontSize: 22, marginBottom: 10 },
  statNum: { fontWeight: 700, fontSize: 28, color: '#111', lineHeight: 1 },
  statLabel: { color: '#888', fontSize: 13, marginTop: 4 },
  statChange: (pos) => ({ fontSize: 12, marginTop: 6, color: pos ? '#111' : '#888', fontWeight: 500 }),

  // Two-col
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  card: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 22px' },
  cardTitle: { fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 16 },

  // Activity
  activityItem: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  avatar: (seed) => ({ width: 34, height: 34, borderRadius: '50%', background: ['#ddd','#ccc','#bbb','#aaa'][seed % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#555', flexShrink: 0 }),
  actText: { flex: 1, fontSize: 13, color: '#333', lineHeight: 1.4 },
  actTime: { fontSize: 11, color: '#aaa', marginTop: 2 },

  // Chart placeholder
  chartPlaceholder: { height: 120, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 4px' },
  chartBar: (h) => ({ flex: 1, background: '#111', borderRadius: '3px 3px 0 0', height: `${h}%`, opacity: 0.15 + h / 140 }),
  lineChartWrap: { height: 120, position: 'relative', overflow: 'hidden' },
  lineSvg: { width: '100%', height: '100%' },

  // Tabs
  tabsRow: { display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #e8e8e8', paddingBottom: 0 },
  tab: (active) => ({ padding: '8px 16px', cursor: 'pointer', fontWeight: active ? 600 : 400, color: active ? '#111' : '#888', borderBottom: active ? '2px solid #111' : '2px solid transparent', background: 'none', border: 'none', fontSize: 13, marginBottom: -1 }),

  // Search + button row
  searchRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  searchInput: { flex: 1, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', background: '#fafafa' },
  addBtn: { background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' },
  filterBtn: { background: '#fff', color: '#444', border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 },

  // Mini stats
  miniStats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 },
  miniStat: { background: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 10, padding: '14px 16px' },
  miniStatNum: { fontWeight: 700, fontSize: 22, color: '#111' },
  miniStatLabel: { fontSize: 12, color: '#888', marginTop: 2 },

  // Table
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 14px', color: '#888', fontWeight: 600, borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap' },
  td: { padding: '11px 14px', borderBottom: '1px solid #f0f0f0', color: '#333', verticalAlign: 'middle' },

  // Badges
  badge: (type) => {
    const map = {
      active:   { background: '#111', color: '#fff' },
      verified: { background: '#111', color: '#fff' },
      assigned: { background: '#111', color: '#fff' },
      resolved: { background: '#111', color: '#fff' },
      pending:  { background: '#fff', color: '#555', border: '1px solid #bbb' },
      blocked:  { background: '#555', color: '#fff' },
      reported: { background: '#555', color: '#fff' },
      completed:{ background: '#e8e8e8', color: '#333' },
      unresolved:{ background: '#fff', color: '#555', border: '1px solid #bbb' },
    };
    const s = map[type] || map.pending;
    return { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: s.border || 'none', ...s };
  },

  // Action buttons
  iconBtn: { background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13, marginRight: 4, color: '#444' },
  actionBtn: (variant) => ({
    background: variant === 'primary' ? '#111' : '#fff',
    color: variant === 'primary' ? '#fff' : '#444',
    border: variant === 'primary' ? 'none' : '1px solid #e8e8e8',
    borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, marginRight: 4,
  }),

  // Emergency
  emergencyCard: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 22px', marginBottom: 16 },
  emergencyHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  emergencyBtns: { display: 'flex', gap: 8, marginTop: 14 },

  // Feedback
  feedbackItem: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0' },
  feedbackMeta: { flex: 1 },

  // Reports
  reportsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 },
  revenueCard: { background: '#111', color: '#fff', borderRadius: 12, padding: '22px 24px', marginBottom: 16 },
  revenueNum: { fontWeight: 700, fontSize: 36, marginTop: 6 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  donutWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 },
  donut: { width: 90, height: 90, borderRadius: '50%', border: '18px solid #111', boxSizing: 'border-box', position: 'relative' },
  genBtns: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 },
  genBtn: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '12px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#333', textAlign: 'center' },

  dropdown: { border: '1px solid #e8e8e8', borderRadius: 8, padding: '6px 12px', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' },
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',             icon: '⊞' },
  { id: 'users',      label: 'User Management',       icon: '👤' },
  { id: 'caregivers', label: 'Caregiver Management',  icon: '⚕' },
  { id: 'services',   label: 'Service Requests',      icon: '☰' },
  { id: 'reports',    label: 'Reports & Analytics',   icon: '↗' },
  { id: 'emergency',  label: 'Emergency Monitoring',  icon: '⚠' },
  { id: 'feedback',   label: 'Feedback Management',   icon: '✉' },
];

const ACTIVITIES = [
  { id: 1, name: 'Riya S.',   text: 'New family member registered',          time: '2 min ago' },
  { id: 2, name: 'Arjun M.',  text: 'Caregiver verified by admin',           time: '15 min ago' },
  { id: 3, name: 'Priya K.',  text: 'Service request #1042 completed',       time: '1 hr ago' },
  { id: 4, name: 'Suresh P.', text: 'Emergency alert triggered — resolved',  time: '3 hr ago' },
  { id: 5, name: 'Meena R.',  text: 'Feedback submitted for caregiver',      time: '5 hr ago' },
];

// const CHART_BARS = [40, 55, 35, 70, 60, 80, 65, 90, 75, 85, 70, 95]; // reserved for future chart

// Simple SVG line chart points
function linePoints(data, w, h) {
  const max = Math.max(...data);
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [caregiverSearch, setCaregiverSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');

  // ── State ──
  const [users, setUsers] = useState([
    { id: 1, name: 'Riya Sharma',   email: 'riya@example.com',   role: 'Family',    joined: '2024-01-10', status: 'active' },
    { id: 2, name: 'Arjun Mehta',   email: 'arjun@example.com',  role: 'Caregiver', joined: '2024-02-14', status: 'active' },
    { id: 3, name: 'Priya Kapoor',  email: 'priya@example.com',  role: 'Nurse',     joined: '2024-03-05', status: 'pending' },
    { id: 4, name: 'Suresh Patel',  email: 'suresh@example.com', role: 'Family',    joined: '2024-03-20', status: 'blocked' },
    { id: 5, name: 'Meena Rao',     email: 'meena@example.com',  role: 'Caregiver', joined: '2024-04-01', status: 'active' },
  ]);

  const [caregivers, setCaregivers] = useState([
    { id: 1, name: 'Arjun Mehta',  experience: '5 yrs', specialization: 'Elder Care',    status: 'verified' },
    { id: 2, name: 'Meena Rao',    experience: '3 yrs', specialization: 'Post-Surgery',  status: 'pending' },
    { id: 3, name: 'Kavya Nair',   experience: '7 yrs', specialization: 'Dementia Care', status: 'verified' },
    { id: 4, name: 'Rohit Singh',  experience: '2 yrs', specialization: 'Physiotherapy', status: 'reported' },
    { id: 5, name: 'Sunita Desai', experience: '4 yrs', specialization: 'Palliative',    status: 'pending' },
  ]);

  const [bookings, setBookings] = useState([
    { id: 1, type: 'Elder Care',    family: 'Riya Sharma',  caregiver: 'Arjun Mehta',  date: '2024-05-01', status: 'completed' },
    { id: 2, type: 'Post-Surgery',  family: 'Suresh Patel', caregiver: '—',            date: '2024-05-10', status: 'pending' },
    { id: 3, type: 'Dementia Care', family: 'Priya Kapoor', caregiver: 'Kavya Nair',   date: '2024-05-12', status: 'assigned' },
    { id: 4, type: 'Physiotherapy', family: 'Meena Rao',    caregiver: '—',            date: '2024-05-15', status: 'pending' },
    { id: 5, type: 'Palliative',    family: 'Riya Sharma',  caregiver: 'Sunita Desai', date: '2024-05-18', status: 'assigned' },
  ]);

  const [emergencies, setEmergencies] = useState([
    { id: 1, patient: 'Ramesh Kumar',  location: '12 MG Road, Bengaluru', time: '5 min ago',  status: 'active' },
    { id: 2, patient: 'Lata Verma',    location: '7 Park St, Kolkata',    time: '1 hr ago',   status: 'resolved' },
    { id: 3, patient: 'Gopal Iyer',    location: '3 Anna Salai, Chennai', time: '3 hr ago',   status: 'resolved' },
  ]);

  const [feedback, setFeedback] = useState([
    { id: 1, user: 'Riya Sharma',  type: 'Complaint',    message: 'Caregiver arrived late twice this week.',          date: '2024-05-10', status: 'unresolved' },
    { id: 2, user: 'Priya Kapoor', type: 'Suggestion',   message: 'Would love a real-time tracking feature.',          date: '2024-05-11', status: 'resolved' },
    { id: 3, user: 'Suresh Patel', type: 'Appreciation', message: 'Arjun was extremely professional and caring.',      date: '2024-05-12', status: 'resolved' },
    { id: 4, user: 'Meena Rao',    type: 'Complaint',    message: 'App crashed during booking — lost my data.',        date: '2024-05-13', status: 'unresolved' },
  ]);

  // ── Handlers ──
  const handleApproveUser = (id) =>
    setUsers(u => u.map(x => x.id === id ? { ...x, status: 'active' } : x));

  const handleBlockUser = (id) =>
    setUsers(u => u.map(x => x.id === id ? { ...x, status: 'blocked' } : x));

  const handleVerifyCaregiver = (id) =>
    setCaregivers(c => c.map(x => x.id === id ? { ...x, status: 'verified' } : x));

  const handleAssignCaregiver = (id) =>
    setBookings(b => b.map(x => x.id === id ? { ...x, status: 'assigned', caregiver: 'Auto-Assigned' } : x));

  const handleDispatchHelp = (id) =>
    setEmergencies(e => e.map(x => x.id === id ? { ...x, status: 'resolved' } : x));

  const handleResolveFeedback = (id) =>
    setFeedback(f => f.map(x => x.id === id ? { ...x, status: 'resolved' } : x));

  // ── Derived counts ──
  const totalUsers      = users.length;
  const familyCount     = users.filter(u => u.role === 'Family').length;
  const caregiverCount  = users.filter(u => u.role === 'Caregiver').length;
  const nurseCount      = users.filter(u => u.role === 'Nurse').length;
  const activeCaregivers   = caregivers.filter(c => c.status === 'verified').length;
  const pendingCaregivers  = caregivers.filter(c => c.status === 'pending').length;
  const reportedCaregivers = caregivers.filter(c => c.status === 'reported').length;
  const completedServices  = bookings.filter(b => b.status === 'completed').length;
  const activeEmergencies  = emergencies.filter(e => e.status === 'active').length;
  const pendingBookings    = bookings.filter(b => b.status === 'pending').length;
  const assignedBookings   = bookings.filter(b => b.status === 'assigned').length;

  const filteredUsers      = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredCaregivers = caregivers.filter(c => c.name.toLowerCase().includes(caregiverSearch.toLowerCase()));
  const filteredBookings   = bookings.filter(b => b.type.toLowerCase().includes(serviceSearch.toLowerCase()) || b.family.toLowerCase().includes(serviceSearch.toLowerCase()));

  // ── Render helpers ──
  const NavItem = ({ item }) => (
    <div style={S.navItem(activeTab === item.id)} onClick={() => setActiveTab(item.id)}>
      <span style={S.navIcon}>{item.icon}</span>
      <span>{item.label}</span>
    </div>
  );

  const Badge = ({ status }) => <span style={S.badge(status)}>{status}</span>;

  // ── Tab content ──
  const renderOverview = () => (
    <>
      <div style={S.statsRow}>
        {[
          { icon: '👥', num: totalUsers,       label: 'Total Users',         change: '+8% this month', pos: true },
          { icon: '🏥', num: activeCaregivers, label: 'Active Caregivers',   change: '+3% this month', pos: true },
          { icon: '✅', num: completedServices,label: 'Completed Services',  change: '+12% this month',pos: true },
          { icon: '🚨', num: activeEmergencies,label: 'Active Emergencies',  change: activeEmergencies > 0 ? 'Needs attention' : 'All clear', pos: activeEmergencies === 0 },
        ].map((s, i) => (
          <div key={i} style={S.statCard}>
            <div style={S.statIcon}>{s.icon}</div>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statChange(s.pos)}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={S.twoCol}>
        {/* Recent Activities */}
        <div style={S.card}>
          <div style={S.cardTitle}>Recent Activities</div>
          {ACTIVITIES.map((a, i) => (
            <div key={a.id} style={S.activityItem}>
              <div style={S.avatar(i)}>{a.name[0]}</div>
              <div>
                <div style={S.actText}><strong>{a.name}</strong> — {a.text}</div>
                <div style={S.actTime}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Overview */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={S.cardTitle}>Platform Overview</div>
            <select style={S.dropdown}><option>This Month</option><option>Last Month</option><option>This Year</option></select>
          </div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>User registrations over time</div>
          <svg viewBox="0 0 300 100" style={{ width: '100%', height: 110 }}>
            <polyline
              fill="none" stroke="#111" strokeWidth="2"
              points={linePoints([20,35,28,50,42,38,60,55,48,70,65,80], 300, 100)}
            />
            <polyline
              fill="rgba(17,17,17,0.07)" stroke="none"
              points={`0,100 ${linePoints([20,35,28,50,42,38,60,55,48,70,65,80], 300, 100)} 300,100`}
            />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bbb', marginTop: 4 }}>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div style={S.card}>
      <div style={S.searchRow}>
        <input style={S.searchInput} placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
        <button style={S.addBtn}>+ Add User</button>
      </div>
      <div style={S.miniStats}>
        {[
          { num: totalUsers,    label: 'Total Users' },
          { num: familyCount,   label: 'Family Members' },
          { num: caregiverCount,label: 'Caregivers' },
          { num: nurseCount,    label: 'Nurses' },
        ].map((s, i) => (
          <div key={i} style={S.miniStat}>
            <div style={S.miniStatNum}>{s.num}</div>
            <div style={S.miniStatLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Name','Email','Role','Joined On','Status','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td style={S.td}><strong>{u.name}</strong></td>
                <td style={S.td}>{u.email}</td>
                <td style={S.td}>{u.role}</td>
                <td style={S.td}>{u.joined}</td>
                <td style={S.td}><Badge status={u.status} /></td>
                <td style={S.td}>
                  <button style={S.iconBtn} title="View">👁</button>
                  {u.status !== 'active'  && <button style={S.actionBtn('primary')} onClick={() => handleApproveUser(u.id)}>Approve</button>}
                  {u.status !== 'blocked' && <button style={S.actionBtn('secondary')} onClick={() => handleBlockUser(u.id)}>Block</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCaregivers = () => (
    <div style={S.card}>
      <div style={S.searchRow}>
        <input style={S.searchInput} placeholder="Search caregivers..." value={caregiverSearch} onChange={e => setCaregiverSearch(e.target.value)} />
        <button style={S.filterBtn}>⊟ Filter</button>
      </div>
      <div style={S.miniStats}>
        {[
          { num: activeCaregivers,   label: 'Active Caregivers' },
          { num: pendingCaregivers,  label: 'Pending Verification' },
          { num: activeCaregivers,   label: 'Verified Caregivers' },
          { num: reportedCaregivers, label: 'Reported Caregivers' },
        ].map((s, i) => (
          <div key={i} style={S.miniStat}>
            <div style={S.miniStatNum}>{s.num}</div>
            <div style={S.miniStatLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Name','Experience','Specialization','Status','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredCaregivers.map(c => (
              <tr key={c.id}>
                <td style={S.td}><strong>{c.name}</strong></td>
                <td style={S.td}>{c.experience}</td>
                <td style={S.td}>{c.specialization}</td>
                <td style={S.td}><Badge status={c.status} /></td>
                <td style={S.td}>
                  {c.status === 'pending' && <button style={S.actionBtn('primary')} onClick={() => handleVerifyCaregiver(c.id)}>✓ Verify</button>}
                  <button style={S.iconBtn} title="View">👁</button>
                  <button style={S.iconBtn} title="More">•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServices = () => (
    <div style={S.card}>
      <div style={S.searchRow}>
        <input style={S.searchInput} placeholder="Search requests..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} />
        <button style={S.filterBtn}>⊟ Filter</button>
      </div>
      <div style={S.miniStats}>
        {[
          { num: bookings.length,  label: 'Total Requests' },
          { num: pendingBookings,  label: 'Pending' },
          { num: assignedBookings, label: 'Assigned' },
          { num: completedServices,label: 'Completed' },
        ].map((s, i) => (
          <div key={i} style={S.miniStat}>
            <div style={S.miniStatNum}>{s.num}</div>
            <div style={S.miniStatLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Request Type','Family','Caregiver','Date','Status','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id}>
                <td style={S.td}><strong>{b.type}</strong></td>
                <td style={S.td}>{b.family}</td>
                <td style={S.td}>{b.caregiver}</td>
                <td style={S.td}>{b.date}</td>
                <td style={S.td}><Badge status={b.status} /></td>
                <td style={S.td}>
                  {b.status === 'pending'
                    ? <button style={S.actionBtn('primary')} onClick={() => handleAssignCaregiver(b.id)}>Assign</button>
                    : <button style={S.actionBtn('secondary')}>View</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <select style={S.dropdown}><option>This Month</option><option>Last Month</option><option>This Year</option></select>
      </div>
      <div style={S.reportsGrid}>
        {[
          { label: 'Total Users',        num: totalUsers,       change: '↑ 12%' },
          { label: 'Active Caregivers',  num: activeCaregivers, change: '↑ 3%' },
          { label: 'Completed Services', num: completedServices,change: '↑ 5%' },
        ].map((s, i) => (
          <div key={i} style={S.statCard}>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statChange(true)}>{s.change}</div>
          </div>
        ))}
      </div>
      <div style={S.revenueCard}>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Total Revenue This Month</div>
        <div style={S.revenueNum}>₹45,000</div>
        <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>↑ 9% from last month</div>
      </div>
      <div style={S.chartsRow}>
        <div style={S.card}>
          <div style={S.cardTitle}>User Growth</div>
          <svg viewBox="0 0 300 100" style={{ width: '100%', height: 100 }}>
            <polyline fill="none" stroke="#111" strokeWidth="2"
              points={linePoints([10,20,18,35,30,45,40,55,50,65,60,75], 300, 100)} />
            <polyline fill="rgba(17,17,17,0.07)" stroke="none"
              points={`0,100 ${linePoints([10,20,18,35,30,45,40,55,50,65,60,75], 300, 100)} 300,100`} />
          </svg>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Services Overview</div>
          <div style={S.donutWrap}>
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              <div style={{ ...S.donut, borderColor: '#111' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 13, fontWeight: 700, color: '#111' }}>
                {completedServices}/{bookings.length}
              </div>
            </div>
            <div style={{ marginLeft: 20, fontSize: 12 }}>
              <div style={{ marginBottom: 6 }}><span style={{ display: 'inline-block', width: 10, height: 10, background: '#111', borderRadius: 2, marginRight: 6 }} />Completed</div>
              <div style={{ marginBottom: 6 }}><span style={{ display: 'inline-block', width: 10, height: 10, background: '#ccc', borderRadius: 2, marginRight: 6 }} />Pending</div>
              <div><span style={{ display: 'inline-block', width: 10, height: 10, background: '#888', borderRadius: 2, marginRight: 6 }} />Assigned</div>
            </div>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Generate Reports</div>
        <div style={S.genBtns}>
          {['User Report','Caregiver Report','Service Report','Revenue Report'].map(r => (
            <button key={r} style={S.genBtn}>{r}</button>
          ))}
        </div>
      </div>
    </>
  );

  const renderEmergency = () => (
    <>
      {emergencies.filter(e => e.status === 'active').map(e => (
        <div key={e.id} style={S.emergencyCard}>
          <div style={S.emergencyHeader}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{e.patient}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>📍 {e.location}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{e.time}</div>
            </div>
            <Badge status="active" />
          </div>
          <div style={S.emergencyBtns}>
            <button style={S.actionBtn('primary')} onClick={() => handleDispatchHelp(e.id)}>Dispatch Help</button>
            <button style={S.actionBtn('secondary')}>Call Patient</button>
            <button style={S.actionBtn('secondary')}>View Location</button>
          </div>
        </div>
      ))}
      {emergencies.filter(e => e.status === 'active').length === 0 && (
        <div style={{ ...S.card, color: '#888', textAlign: 'center', padding: 40 }}>No active emergencies right now.</div>
      )}
      <div style={S.card}>
        <div style={S.cardTitle}>Recent Emergencies</div>
        {emergencies.map(e => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{e.patient}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{e.location} · {e.time}</div>
            </div>
            <Badge status={e.status} />
          </div>
        ))}
      </div>
    </>
  );

  const renderFeedback = () => (
    <div style={S.card}>
      <div style={S.cardTitle}>Feedback Management</div>
      {feedback.map(f => (
        <div key={f.id} style={S.feedbackItem}>
          <div style={{ ...S.avatar(f.id), width: 38, height: 38, fontSize: 14 }}>{f.user[0]}</div>
          <div style={S.feedbackMeta}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <strong style={{ fontSize: 13 }}>{f.user}</strong>
              <span style={{ ...S.badge(f.type === 'Complaint' ? 'reported' : f.type === 'Appreciation' ? 'active' : 'pending'), fontSize: 10 }}>{f.type}</span>
            </div>
            <div style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{f.message}</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>{f.date}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
            <Badge status={f.status} />
            {f.status === 'unresolved' && (
              <button style={S.actionBtn('primary')} onClick={() => handleResolveFeedback(f.id)}>Resolve</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const tabContent = {
    overview:   renderOverview(),
    users:      renderUsers(),
    caregivers: renderCaregivers(),
    services:   renderServices(),
    reports:    renderReports(),
    emergency:  renderEmergency(),
    feedback:   renderFeedback(),
  };

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.logoRow}>
            <div style={S.logoBox}>A</div>
            <span style={S.logoText}>Admin Dashboard</span>
          </div>
        </div>
        <nav style={S.navList}>
          {NAV_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
        </nav>
        <div style={S.sidebarBottom}>
          <div style={S.navItem(false)}>
            <span style={S.navIcon}>⚙</span>
            <span>Settings</span>
          </div>
          <div style={S.navItem(false)} onClick={logout}>
            <span style={S.navIcon}>↩</span>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>
        {/* Top bar */}
        <header style={S.topbar}>
          <div style={S.topbarLeft}>
            <h1 style={S.topbarTitle}>Welcome back, Admin 👋</h1>
            <p style={S.topbarSub}>Here's what's happening on your platform today.</p>
          </div>
          <div style={S.topbarRight}>
            <div style={S.bellWrap}>
              <span style={S.bellIcon}>🔔</span>
              <span style={S.bellBadge}>3</span>
            </div>
            <button style={S.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </header>

        {/* Content */}
        <div style={S.content}>
          {/* Tab nav */}
          <div style={S.tabsRow}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} style={S.tab(activeTab === item.id)} onClick={() => setActiveTab(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tabContent[activeTab]}
        </div>
      </main>
    </div>
  );
}
