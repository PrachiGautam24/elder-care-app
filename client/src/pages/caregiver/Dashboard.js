import { useState, useEffect, useContext } from 'react';
import { getPatients, createPatient, deletePatient } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const CaregiverDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('assigned');
  const [showFindPatients, setShowFindPatients] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedElderly, setAssignedElderly] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning medicine', patient: 'Ramesh Kumar', time: '8:00 AM', completed: true, overdue: false },
    { id: 2, title: 'Breakfast assistance', patient: 'Lakshmi Devi', time: '9:00 AM', completed: true, overdue: false },
    { id: 3, title: 'Evening walk', patient: 'Ramesh Kumar', time: '10:00 AM', completed: false, overdue: false },
    { id: 4, title: 'Evening medicine', patient: 'Lakshmi Devi', time: '6:00 PM', completed: false, overdue: true },
  ]);
  const [availability, setAvailability] = useState({
    workingHours: '9 AM - 5 PM',
    availableDays: 'Mon - Sat',
    slots: [
      { id: 1, time: '9:00 AM – 1:00 PM', available: true },
      { id: 2, time: '2:00 PM – 6:00 PM', available: true },
      { id: 3, time: '7:00 PM – 9:00 PM', available: false },
    ],
  });
  const [serviceRequests, setServiceRequests] = useState([
    { id: 101, name: 'Vijay Singh', age: 74, needs: 'Medication reminders', status: 'pending' },
    { id: 102, name: 'Nirmala Devi', age: 69, needs: 'Bathing support', status: 'pending' },
  ]);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1); // index into week days

  useEffect(() => {
    const loadAssigned = async () => {
      try {
        const { data } = await getPatients();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(p => ({ ...p, id: p._id || p.id }));
          setAssignedElderly(normalized);
          localStorage.setItem('assignedElderly', JSON.stringify(normalized));
          return;
        }
      } catch (error) {
        console.error('Unable to load assigned elderly from API:', error);
      }
      const saved = JSON.parse(localStorage.getItem('assignedElderly') || '[]');
      if (saved && saved.length > 0) setAssignedElderly(saved);
    };

    const loadTasks = () => {
      const savedTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
      if (savedTasks && savedTasks.length > 0) setTasks(savedTasks);
    };

    loadAssigned();
    loadTasks();
  }, []);

  const fakePatients = [
    { id: 1, name: 'Ramesh Kumar', age: 72, location: 'Andheri, Mumbai', condition: 'Daily care, Meal assistance', photo: 'R' },
    { id: 2, name: 'Lakshmi Devi', age: 68, location: 'Powai, Mumbai', condition: 'Walking assistance, Hygiene support', photo: 'L' },
    { id: 3, name: 'Suresh Patel', age: 75, location: 'Vikhroli, Mumbai', condition: 'Companionship, Meal preparation', photo: 'S' },
    { id: 4, name: 'Savitri Sharma', age: 70, location: 'Ghatkopar, Mumbai', condition: 'Daily care, Medicine reminders', photo: 'S' },
  ];

  const acceptPatient = async (patient) => {
    const assigned = { ...patient, status: 'active', assignedTo: 'caregiver' };
    const updated = [...assignedElderly, assigned];
    setAssignedElderly(updated);
    localStorage.setItem('assignedElderly', JSON.stringify(updated));
    try {
      await createPatient({ name: patient.name, age: patient.age, condition: patient.needs || patient.condition, medications: '', status: 'stable', assignedTo: 'caregiver' });
    } catch (error) {
      console.error('Unable to persist assignment to backend:', error);
    }
    setServiceRequests(serviceRequests.map(req => req.id === patient.id ? { ...req, status: 'accepted' } : req));
  };

  // declineRequest kept for future use
  const declineRequest = (id) => { // eslint-disable-line no-unused-vars
    setServiceRequests(serviceRequests.map(req => req.id === id ? { ...req, status: 'declined' } : req));
  };

  const removeAssigned = async (id) => {
    const filtered = assignedElderly.filter(item => item.id !== id);
    setAssignedElderly(filtered);
    localStorage.setItem('assignedElderly', JSON.stringify(filtered));
    try {
      await deletePatient(id);
    } catch (error) {
      console.error('Unable to delete assigned elderly from backend:', error);
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.taskTitle.value;
    const time = form.taskTime.value;
    if (!title || !time) return;
    const added = [...tasks, { id: Date.now(), title, patient: 'General', time, completed: false, overdue: false }];
    setTasks(added);
    localStorage.setItem('dailyTasks', JSON.stringify(added));
    form.reset();
  };

  const toggleTask = (id) => {
    const updated = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTasks(updated);
    localStorage.setItem('dailyTasks', JSON.stringify(updated));
  };

  const toggleSlot = (id) => {
    setAvailability(prev => ({
      ...prev,
      slots: prev.slots.map(slot => slot.id === id ? { ...slot, available: !slot.available } : slot),
    }));
  };

  const navItems = [
    { key: 'assigned', icon: '👥', label: 'Assigned Elderly' },
    { key: 'tasks', icon: '✓', label: 'Daily Tasks' },
    { key: 'availability', icon: '◷', label: 'Availability' },
    { key: 'location', icon: '◎', label: 'Location' },
    { key: 'reviews', icon: '★', label: 'Reviews' },
  ];

  const weekDays = [
    { label: 'Sun', date: 7 }, { label: 'Mon', date: 8 }, { label: 'Tue', date: 9 },
    { label: 'Wed', date: 10 }, { label: 'Thu', date: 11 }, { label: 'Fri', date: 12 }, { label: 'Sat', date: 13 },
  ];

  const filteredPatients = fakePatients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed && !t.overdue).length;
  const overdueTasks = tasks.filter(t => t.overdue && !t.completed).length;

  return (
    <div style={s.root}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.logo}>C</div>

        <nav style={s.nav}>
          {navItems.map(item => (
            <div key={item.key} style={s.navItemWrap}
              onMouseEnter={() => setHoveredNav(item.key)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <button
                style={activeTab === item.key ? s.navBtnActive : s.navBtn}
                onClick={() => setActiveTab(item.key)}
                aria-label={item.label}
              >
                <span style={s.navIcon}>{item.icon}</span>
              </button>
              {hoveredNav === item.key && (
                <div style={s.tooltip}>{item.label}</div>
              )}
            </div>
          ))}
        </nav>

        <div style={s.navBottom}>
          <div style={s.navItemWrap}
            onMouseEnter={() => setHoveredNav('settings')}
            onMouseLeave={() => setHoveredNav(null)}
          >
            <button style={s.navBtn} aria-label="Settings">
              <span style={s.navIcon}>⚙</span>
            </button>
            {hoveredNav === 'settings' && <div style={s.tooltip}>Settings</div>}
          </div>
          <div style={s.navItemWrap}
            onMouseEnter={() => setHoveredNav('logout')}
            onMouseLeave={() => setHoveredNav(null)}
          >
            <button style={s.navBtn} onClick={logout} aria-label="Logout">
              <span style={s.navIcon}>↩</span>
            </button>
            {hoveredNav === 'logout' && <div style={s.tooltip}>Logout</div>}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>
        {/* Header */}
        <header style={s.header}>
          <div>
            <div style={s.headerTitle}>Caregiver Dashboard</div>
            <div style={s.headerSub}>Professional Care Services</div>
          </div>
          <div style={s.headerRight}>
            <span style={s.ratingText}>Your Rating ★ 4.8</span>
            <button style={s.bellBtn} aria-label="Notifications">🔔</button>
            <button style={s.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </header>

        {/* Content */}
        <div style={s.content}>

          {/* ══ ASSIGNED ELDERLY TAB ══ */}
          {activeTab === 'assigned' && (
            <div>
              <div style={s.statsRow}>
                {[
                  { icon: '👥', value: assignedElderly.length, label: 'Assigned Elderly' },
                  { icon: '✓', value: `${completedTasks}/${tasks.length}`, label: 'Tasks Completed' },
                  { icon: '★', value: '4.8', label: 'Average Rating' },
                  { icon: '₹', value: '12,500', label: 'This Month' },
                ].map((card, i) => (
                  <div key={i} style={s.statCard}>
                    <span style={s.statIcon}>{card.icon}</span>
                    <div style={s.statValue}>{card.value}</div>
                    <div style={s.statLabel}>{card.label}</div>
                  </div>
                ))}
              </div>

              <button style={s.findBtn} onClick={() => setShowFindPatients(!showFindPatients)}>
                🔍 Find Patients
              </button>

              {showFindPatients && (
                <div style={s.findPanel}>
                  <input
                    style={s.searchInput}
                    placeholder="Search by name or location…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <div style={s.findList}>
                    {filteredPatients.map(p => (
                      <div key={p.id} style={s.findItem}>
                        <div style={s.avatarCircle}>{p.photo}</div>
                        <div style={s.findInfo}>
                          <div style={s.findName}>{p.name}, {p.age}</div>
                          <div style={s.findMeta}>◎ {p.location}</div>
                          <div style={s.findMeta}>{p.condition}</div>
                        </div>
                        <button style={s.outlineBtn} onClick={() => acceptPatient(p)}>View Profile</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={s.cardList}>
                {assignedElderly.length === 0 ? (
                  <div style={s.emptyText}>No elderly assigned yet. Click "Find Patients" to browse.</div>
                ) : (
                  assignedElderly.map(el => (
                    <div key={el.id} style={s.patientCard}>
                      <div style={s.patientCardTop}>
                        <div style={s.avatarCircle}>{(el.name || 'E')[0]}</div>
                        <div style={s.patientInfo}>
                          <div style={s.patientName}>{el.name}</div>
                          <div style={s.patientMeta}>{el.age} yrs · {el.gender || 'N/A'}</div>
                        </div>
                        <span style={s.stableBadge}>Stable</span>
                      </div>
                      <div style={s.actionRow}>
                        <button style={s.outlineBtn}>View Details</button>
                        <button style={s.outlineBtn}>Update Care Log</button>
                        <button style={s.outlineBtn}>Contact Family</button>
                        <button style={s.outlineBtn} onClick={() => removeAssigned(el.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══ DAILY TASKS TAB ══ */}
          {activeTab === 'tasks' && (
            <div>
              <div style={s.statsRow}>
                {[
                  { icon: '✓', value: tasks.length, label: 'Total Tasks' },
                  { icon: '✓', value: completedTasks, label: 'Completed' },
                  { icon: '◷', value: pendingTasks, label: 'Pending' },
                  { icon: '!', value: overdueTasks, label: 'Overdue' },
                ].map((card, i) => (
                  <div key={i} style={s.statCard}>
                    <span style={s.statIcon}>{card.icon}</span>
                    <div style={s.statValue}>{card.value}</div>
                    <div style={s.statLabel}>{card.label}</div>
                  </div>
                ))}
              </div>

              <div style={s.dateNav}>
                <button style={s.dateArrow}>{'<'}</button>
                <span style={s.dateLabel}>Today, 8 Mar 2025</span>
                <button style={s.dateArrow}>{'>'}</button>
              </div>

              <div style={s.cardList}>
                {tasks.map(task => {
                  const isOverdue = task.overdue && !task.completed;
                  return (
                    <div key={task.id} style={s.taskCard}>
                      <button
                        style={task.completed ? s.taskCircleDone : isOverdue ? s.taskCircleOverdue : s.taskCircle}
                        onClick={() => toggleTask(task.id)}
                        aria-label="Toggle task"
                      >
                        {task.completed ? '✓' : isOverdue ? '!' : ''}
                      </button>
                      <div style={s.taskMid}>
                        <div style={task.completed ? s.taskTitleDone : s.taskTitle}>{task.title}</div>
                        <div style={s.taskSub}>{task.patient} · {task.time}</div>
                      </div>
                      <span style={task.completed ? s.badgeDone : isOverdue ? s.badgeOverdue : s.badgePending}>
                        {task.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form style={s.addTaskForm} onSubmit={addTask}>
                <input name="taskTitle" style={s.inlineInput} placeholder="Task name" required />
                <input name="taskTime" style={s.inlineInput} placeholder="Time (e.g. 7:30 AM)" required />
                <button type="submit" style={s.addTaskBtn}>+ Add Task</button>
              </form>
            </div>
          )}

          {/* ══ AVAILABILITY TAB ══ */}
          {activeTab === 'availability' && (
            <div>
              <div style={s.weekHeader}>
                <span style={s.monthLabel}>March 2025</span>
              </div>
              <div style={s.weekStrip}>
                {weekDays.map((d, i) => (
                  <button
                    key={i}
                    style={selectedDay === i ? s.dayBtnActive : s.dayBtn}
                    onClick={() => setSelectedDay(i)}
                  >
                    <div style={s.dayLabel}>{d.label}</div>
                    <div style={selectedDay === i ? s.dayNumActive : s.dayNum}>{d.date}</div>
                  </button>
                ))}
              </div>

              <div style={s.cardList}>
                {availability.slots.map(slot => (
                  <div key={slot.id} style={s.slotCard}>
                    <div style={s.slotTime}>{slot.time}</div>
                    <div style={s.slotStatus}>{slot.available ? 'Available' : 'Unavailable'}</div>
                    <div style={s.slotRight}>
                      <button
                        style={slot.available ? s.toggleOn : s.toggleOff}
                        onClick={() => toggleSlot(slot.id)}
                        aria-label="Toggle availability"
                      >
                        <div style={slot.available ? s.toggleThumbOn : s.toggleThumbOff} />
                      </button>
                      <button style={s.editLink}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>

              <button style={s.findBtn}>+ Add Time Slot</button>
            </div>
          )}

          {/* ══ LOCATION TAB ══ */}
          {activeTab === 'location' && (
            <div>
              <div style={s.mapBox}>
                <span style={s.mapPin}>📍</span>
              </div>

              <div style={s.locationSection}>
                <div style={s.locationSectionTitle}>Primary Location</div>
                <div style={s.locationRow}>
                  <span style={s.locationAddr}>Andheri West, Mumbai, Maharashtra 400058</span>
                  <button style={s.outlineBtn}>Edit</button>
                </div>
              </div>

              <div style={s.locationSection}>
                <div style={s.locationSectionTitle}>Service Areas</div>
                <div style={s.chipsRow}>
                  {['Andheri', 'Powai', 'Vikhroli', 'Ghatkopar', 'Bandra'].map(area => (
                    <span key={area} style={s.chipFilled}>{area}</span>
                  ))}
                  <span style={s.chipOutline}>+ Add Area</span>
                </div>
              </div>
            </div>
          )}

          {/* ══ REVIEWS TAB ══ */}
          {activeTab === 'reviews' && (
            <div>
              <div style={s.statsRow}>
                {[
                  { value: '4.8', label: 'Average Rating' },
                  { value: '45', label: 'Total Reviews' },
                  { value: '42', label: 'Positive Reviews' },
                  { value: '3', label: 'Improvement Areas' },
                ].map((card, i) => (
                  <div key={i} style={s.statCard}>
                    <div style={s.statValue}>{card.value}</div>
                    <div style={s.statLabel}>{card.label}</div>
                  </div>
                ))}
              </div>

              <div style={s.cardList}>
                {[
                  { name: 'Priya Sharma', role: 'Family Member', stars: 5, date: '2 Mar 2025', text: 'Excellent caregiver! Very professional and caring. My mother is very happy with the service provided.' },
                  { name: 'Rajesh Kumar', role: 'Family Member', stars: 4, date: '24 Feb 2025', text: 'Good service. Very punctual and takes good care of my father during the daily visits.' },
                  { name: 'Anita Mehta', role: 'Family Member', stars: 5, date: '18 Feb 2025', text: 'Highly recommended. Compassionate and skilled. Our family feels at ease knowing she is there.' },
                ].map((rev, i) => (
                  <div key={i} style={s.reviewCard}>
                    <div style={s.reviewTop}>
                      <div style={s.avatarCircle}>{rev.name[0]}</div>
                      <div style={s.reviewMeta}>
                        <div style={s.reviewName}>{rev.name}</div>
                        <div style={s.reviewRole}>{rev.role}</div>
                      </div>
                      <div style={s.reviewRight}>
                        <div style={s.reviewStars}>{'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}</div>
                        <div style={s.reviewDate}>{rev.date}</div>
                      </div>
                    </div>
                    <div style={s.reviewText}>{rev.text}</div>
                  </div>
                ))}
              </div>

              <button style={s.outlineBtnFull}>View All Reviews</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const s = {
  // Layout
  root: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: "'Inter', 'Segoe UI', sans-serif" },

  // Sidebar
  sidebar: { width: '72px', minWidth: '72px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 },
  logo: { width: '40px', height: '40px', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontWeight: '700', fontSize: '18px', marginBottom: '28px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navBottom: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItemWrap: { position: 'relative' },
  navBtn: { width: '48px', height: '48px', border: 'none', background: 'transparent', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  navBtnActive: { width: '48px', height: '48px', border: 'none', backgroundColor: '#000', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  navIcon: { lineHeight: 1 },
  tooltip: { position: 'absolute', left: '56px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#1a1a1a', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', whiteSpace: 'nowrap', zIndex: 200, pointerEvents: 'none' },

  // Main
  main: { marginLeft: '72px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' },

  // Header
  header: { position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a' },
  headerSub: { fontSize: '12px', color: '#888', marginTop: '2px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  ratingText: { fontSize: '13px', color: '#555' },
  bellBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px' },
  logoutBtn: { padding: '8px 18px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  // Content
  content: { padding: '28px 32px', flex: 1 },

  // Stat cards
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px', textAlign: 'center' },
  statIcon: { fontSize: '22px', display: 'block', marginBottom: '8px' },
  statValue: { fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#888' },

  // Find patients button
  findBtn: { width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' },

  // Find panel
  findPanel: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px', marginBottom: '20px' },
  searchInput: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' },
  findList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  findItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '10px' },
  findInfo: { flex: 1 },
  findName: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' },
  findMeta: { fontSize: '12px', color: '#888' },

  // Avatar
  avatarCircle: { width: '40px', height: '40px', minWidth: '40px', backgroundColor: '#e8e8e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', color: '#555' },

  // Card list
  cardList: { display: 'flex', flexDirection: 'column', gap: '14px' },

  // Patient card
  patientCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px' },
  patientCardTop: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
  patientInfo: { flex: 1 },
  patientName: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' },
  patientMeta: { fontSize: '13px', color: '#888' },
  stableBadge: { padding: '4px 12px', border: '1px solid #1a1a1a', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#1a1a1a', backgroundColor: 'transparent' },
  actionRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },

  // Outline button
  outlineBtn: { padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#1a1a1a', cursor: 'pointer' },
  outlineBtnFull: { width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', cursor: 'pointer', marginTop: '16px' },

  // Empty
  emptyText: { textAlign: 'center', padding: '40px', color: '#aaa', fontSize: '14px' },

  // Tasks
  dateNav: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  dateArrow: { background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '14px', color: '#555' },
  dateLabel: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a' },
  taskCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' },
  taskCircle: { width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', border: '2px solid #ccc', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#ccc' },
  taskCircleDone: { width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', border: '2px solid #000', backgroundColor: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff' },
  taskCircleOverdue: { width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', border: '2px solid #555', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#555', fontWeight: '700' },
  taskMid: { flex: 1 },
  taskTitle: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' },
  taskTitleDone: { fontSize: '14px', fontWeight: '600', color: '#aaa', textDecoration: 'line-through', marginBottom: '2px' },
  taskSub: { fontSize: '12px', color: '#888' },
  badgeDone: { padding: '4px 10px', backgroundColor: '#000', color: '#fff', borderRadius: '20px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' },
  badgePending: { padding: '4px 10px', border: '1px solid #ccc', color: '#555', borderRadius: '20px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' },
  badgeOverdue: { padding: '4px 10px', border: '1px solid #555', color: '#1a1a1a', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  addTaskForm: { display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' },
  inlineInput: { flex: 1, minWidth: '140px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  addTaskBtn: { padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

  // Availability
  weekHeader: { marginBottom: '8px' },
  monthLabel: { fontSize: '13px', color: '#888', fontWeight: '500' },
  weekStrip: { display: 'flex', gap: '8px', marginBottom: '24px' },
  dayBtn: { flex: 1, padding: '10px 4px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' },
  dayBtnActive: { flex: 1, padding: '10px 4px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' },
  dayLabel: { fontSize: '11px', color: '#888', marginBottom: '6px' },
  dayNum: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', borderRadius: '50%' },
  dayNumActive: { fontSize: '15px', fontWeight: '600', color: '#fff', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', borderRadius: '50%', backgroundColor: '#000' },
  slotCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' },
  slotTime: { flex: 1, fontSize: '14px', fontWeight: '600', color: '#1a1a1a' },
  slotStatus: { fontSize: '13px', color: '#888', minWidth: '90px' },
  slotRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  toggleOn: { width: '44px', height: '24px', backgroundColor: '#000', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 },
  toggleOff: { width: '44px', height: '24px', backgroundColor: '#ccc', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 },
  toggleThumbOn: { width: '18px', height: '18px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', right: '3px', transition: 'right 0.2s' },
  toggleThumbOff: { width: '18px', height: '18px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px', transition: 'left 0.2s' },
  editLink: { background: 'none', border: 'none', fontSize: '13px', color: '#555', cursor: 'pointer', textDecoration: 'underline' },

  // Location
  mapBox: { height: '200px', backgroundColor: '#e8e8e8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  mapPin: { fontSize: '40px' },
  locationSection: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  locationSectionTitle: { fontSize: '13px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' },
  locationRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  locationAddr: { fontSize: '14px', color: '#1a1a1a' },
  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chipFilled: { padding: '6px 14px', backgroundColor: '#000', color: '#fff', borderRadius: '20px', fontSize: '13px', fontWeight: '500' },
  chipOutline: { padding: '6px 14px', border: '1px solid #ccc', color: '#555', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' },

  // Reviews
  reviewCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px', marginBottom: '0' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' },
  reviewRole: { fontSize: '12px', color: '#888' },
  reviewRight: { textAlign: 'right' },
  reviewStars: { fontSize: '14px', color: '#1a1a1a', marginBottom: '2px' },
  reviewDate: { fontSize: '11px', color: '#aaa' },
  reviewText: { fontSize: '13px', color: '#555', lineHeight: '1.6' },
};

export default CaregiverDashboard;
