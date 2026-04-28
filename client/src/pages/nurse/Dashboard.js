import { useState, useEffect, useContext } from 'react';
import { getPatients, createPatient, deletePatient } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

// ─── AVAILABLE PATIENTS (Find Patients panel) ────────────────────────────────
const AVAILABLE_PATIENTS = [
  { id: 'ap1', name: 'Suresh Mehta',  age: 70, gender: 'Male',   location: 'Andheri, Mumbai',  condition: 'Diabetes',     careType: 'Daily Care' },
  { id: 'ap2', name: 'Kamla Devi',    age: 68, gender: 'Female', location: 'Powai, Mumbai',    condition: 'Arthritis',    careType: 'Elderly Care' },
  { id: 'ap3', name: 'Harish Patel',  age: 75, gender: 'Male',   location: 'Vikhroli, Mumbai', condition: 'Hypertension', careType: 'Medical Assistance' },
  { id: 'ap4', name: 'Meena Joshi',   age: 65, gender: 'Female', location: 'Bandra, Mumbai',   condition: 'Post-Surgery', careType: 'Recovery Care' },
];
const CARE_TYPE_FILTERS = ['All', 'Daily Care', 'Elderly Care', 'Medical Assistance', 'Recovery Care'];

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard',      icon: '🏠', label: 'Dashboard' },
  { key: 'patients',       icon: '👥', label: 'Patients' },
  { key: 'medications',    icon: '💊', label: 'Medications' },
  { key: 'appointments',   icon: '📅', label: 'Appointments' },
  { key: 'health-records', icon: '📋', label: 'Health Records' },
  { key: 'tasks',          icon: '✅', label: 'Tasks' },
  { key: 'alerts',         icon: '⚠️',  label: 'Alerts' },
  { key: 'reports',        icon: '📄', label: 'Reports' },
  { key: 'messages',       icon: '💬', label: 'Messages' },
  { key: 'settings',       icon: '⚙️',  label: 'Settings' },
];

// ─── SHARED STYLE HELPERS ─────────────────────────────────────────────────────
const card = {
  backgroundColor: '#fff',
  border: '1px solid #e8e8e8',
  borderRadius: 12,
  padding: '20px 24px',
};

const pillBtn = (active) => ({
  padding: '7px 18px',
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1.5px solid #111',
  backgroundColor: active ? '#111' : '#fff',
  color: active ? '#fff' : '#111',
  transition: 'background 0.15s',
});

const blackBtn = {
  padding: '8px 18px',
  backgroundColor: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const outlineBtn = {
  padding: '7px 14px',
  backgroundColor: 'transparent',
  color: '#111',
  border: '1.5px solid #111',
  borderRadius: 7,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const formInput = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  color: '#111',
  backgroundColor: '#fff',
};

const formSelect = {
  ...formInput,
  cursor: 'pointer',
};

const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  color: '#111',
  marginBottom: 16,
};

const avatarCircle = (bg = '#111', size = 38) => ({
  width: size,
  height: size,
  minWidth: size,
  borderRadius: '50%',
  backgroundColor: bg,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: size * 0.42,
  flexShrink: 0,
});

const getInitial = (name = '') => (name || '?').charAt(0).toUpperCase();

const statusBadge = (status) => {
  if (status === 'Active')           return { bg: '#111', color: '#fff' };
  if (status === 'Nurse Attention')  return { bg: '#fff', color: '#b45309', border: '1.5px solid #b45309' };
  if (status === 'Stable')           return { bg: '#f3f4f6', color: '#374151' };
  if (status === 'critical')         return { bg: '#fee2e2', color: '#b91c1c' };
  if (status === 'high')             return { bg: '#fff7ed', color: '#c2410c' };
  if (status === 'medium')           return { bg: '#fefce8', color: '#a16207' };
  return { bg: '#f3f4f6', color: '#374151' };
};

const priorityBadge = (p) => {
  if (p === 'High')   return { bg: '#111', color: '#fff' };
  if (p === 'Medium') return { bg: '#fff', color: '#374151', border: '1.5px solid #e8e8e8' };
  return { bg: '#f9fafb', color: '#9ca3af' };
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const NurseDashboard = () => {
  const { logout } = useContext(AuthContext);

  // ── sidebar ──────────────────────────────────────────────────────────────
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // ── active tab ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── shared patients ──────────────────────────────────────────────────────
  const [patients, setPatients] = useState([
    { id: 1, name: 'Ramesh Kumar',  age: 72, gender: 'Male',   condition: 'Hypertension', bp: '160/98', hr: '102 bpm', temp: '98.6°F', spo2: '96%', status: 'Active',           room: '101', lastVisit: '5 Mar 2025',  nurse: 'Nurse Priya' },
    { id: 2, name: 'Savita Devi',   age: 65, gender: 'Female', condition: 'Diabetes',     bp: '140/90', hr: '88 bpm',  temp: '99.1°F', spo2: '97%', status: 'Nurse Attention',  room: '102', lastVisit: '3 Mar 2025',  nurse: 'Nurse Priya' },
    { id: 3, name: 'Vijay Singh',   age: 74, gender: 'Male',   condition: 'Arthritis',    bp: '130/85', hr: '76 bpm',  temp: '98.2°F', spo2: '98%', status: 'Stable',           room: '103', lastVisit: '3 Mar 2025',  nurse: 'Nurse Priya' },
    { id: 4, name: 'Kamla Devi',    age: 68, gender: 'Female', condition: 'Heart Disease',bp: '150/95', hr: '95 bpm',  temp: '98.8°F', spo2: '94%', status: 'Stable',           room: '104', lastVisit: '1 Mar 2025',  nurse: 'Nurse Priya' },
    { id: 5, name: 'Harish Patel',  age: 75, gender: 'Male',   condition: 'COPD',         bp: '145/92', hr: '90 bpm',  temp: '99.0°F', spo2: '93%', status: 'Stable',           room: '105', lastVisit: '25 Feb 2025', nurse: 'Nurse Priya' },
    { id: 6, name: 'Sunita Mehta',  age: 60, gender: 'Female', condition: 'Asthma',       bp: '125/80', hr: '72 bpm',  temp: '98.4°F', spo2: '99%', status: 'Stable',           room: '106', lastVisit: '20 Feb 2025', nurse: 'Nurse Priya' },
  ]);

  // ── shared medications ───────────────────────────────────────────────────
  const [medications, setMedications] = useState([
    { id: 1, name: 'Amlodipine 5mg',  patient: 'Ramesh Kumar', patientId: 1, dose: '1 Tablet', time: '08:00 AM', given: false, upcoming: true },
    { id: 2, name: 'Metformin 500mg', patient: 'Savita Devi',  patientId: 2, dose: '1 Tablet', time: '08:00 AM', given: false, upcoming: true },
    { id: 3, name: 'Alendronate 4mg', patient: 'Vijay Singh',  patientId: 3, dose: '1 Tablet', time: '09:00 AM', given: false, upcoming: true },
    { id: 4, name: 'Aspirin 75mg',    patient: 'Harish Patel', patientId: 5, dose: '1 Tablet', time: '09:00 AM', given: false, upcoming: true },
    { id: 5, name: 'Salbutamol 5mg',  patient: 'Sunita Mehta', patientId: 6, dose: '1 Tablet', time: '10:00 AM', given: false, upcoming: false },
  ]);

  // ── shared tasks ─────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Check BP – Ramesh Kumar',        patientId: 1, room: '101',    time: '08:00 AM', priority: 'High',   status: 'Pending' },
    { id: 2, title: 'Give Medication – Savita Devi',  patientId: 2, room: '102',    time: '08:30 AM', priority: 'Medium', status: 'Pending' },
    { id: 3, title: 'Follow-up Visit – Vijay Singh',  patientId: 3, room: '103',    time: '09:00 AM', priority: 'Low',    status: 'Pending' },
    { id: 4, title: 'Update Health Record – Kamla Devi', patientId: 4, room: '104', time: '10:00 AM', priority: 'Medium', status: 'Pending' },
    { id: 5, title: 'Daily Report Submission',        patientId: null, room: 'Office', time: '05:00 PM', priority: 'High', status: 'Active' },
  ]);

  // ── shared alerts ────────────────────────────────────────────────────────
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'High Blood Pressure', patient: 'Ramesh Kumar', patientId: 1, detail: 'BP: 160/98 – Room 101',           time: '2 min ago',  severity: 'critical', resolved: false },
    { id: 2, type: 'Fall Detected',       patient: 'Savita Devi',  patientId: 2, detail: 'Motion sensor – Room 102',        time: '15 min ago', severity: 'high',     resolved: false },
    { id: 3, type: 'SOS Alert',           patient: 'Vijay Singh',  patientId: 3, detail: 'Patient pressed SOS – Room 103', time: '30 min ago', severity: 'critical', resolved: false },
    { id: 4, type: 'High Heart Rate',     patient: 'Harish Patel', patientId: 5, detail: 'HR: 105 bpm – Room 105',          time: '1 hr ago',   severity: 'high',     resolved: false },
    { id: 5, type: 'Low Oxygen Level',    patient: 'Sunita Mehta', patientId: 6, detail: 'SpO2: 91% – Room 106',            time: '2 hr ago',   severity: 'medium',   resolved: true  },
  ]);

  // ── shared messages ──────────────────────────────────────────────────────
  const [messages, setMessages] = useState([
    { id: 1, from: 'Dr. Anjali Verma',     role: 'Doctor', avatar: 'A', time: '10:30 AM', text: 'Please check Ramesh Kumar BP again.',    unread: true  },
    { id: 2, from: 'Savita Devi (Family)', role: 'Family', avatar: 'S', time: '09:45 AM', text: 'How is my mother doing today?',           unread: true  },
    { id: 3, from: 'Vijay Singh (Family)', role: 'Family', avatar: 'V', time: '09:00 AM', text: 'Can we schedule a follow-up?',            unread: false },
    { id: 4, from: 'Dr. Meena Joshi',      role: 'Doctor', avatar: 'M', time: '08:30 AM', text: 'Medication updated for Kamla Devi.',      unread: false },
    { id: 5, from: 'Harish Patel (Family)',role: 'Family', avatar: 'H', time: '08:00 AM', text: 'Please update us on his condition.',      unread: false },
  ]);

  // ── appointments ─────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Ramesh Kumar', patientId: 1, time: '09:00 AM', type: 'General Checkup',        doctor: 'Dr. Anjali Verma', status: 'Upcoming' },
    { id: 2, patient: 'Savita Devi',  patientId: 2, time: '11:00 AM', type: 'Diabetes Follow-up',     doctor: 'Dr. Rajesh Patel', status: 'Upcoming' },
    { id: 3, patient: 'Vijay Singh',  patientId: 3, time: '02:00 PM', type: 'Physiotherapy Session',  doctor: 'Dr. Meena Joshi',  status: 'Upcoming' },
  ]);

  // ── health records selected patient ──────────────────────────────────────
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [hrInnerTab, setHrInnerTab] = useState('overview');

  // ── patients tab state ───────────────────────────────────────────────────
  const [patientSearch, setPatientSearch] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [showFindPatients, setShowFindPatients] = useState(false);
  const [findSearch, setFindSearch] = useState('');
  const [careTypeFilter, setCareTypeFilter] = useState('All');
  const [expandedProfile, setExpandedProfile] = useState(null);

  // ── medications tab state ────────────────────────────────────────────────
  const [medTab, setMedTab] = useState('due');
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', patientId: '', dose: '', time: '' });

  // ── tasks tab state ──────────────────────────────────────────────────────
  const [taskTab, setTaskTab] = useState('pending');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', patientId: '', room: '', time: '', priority: 'Medium' });

  // ── alerts tab state ─────────────────────────────────────────────────────
  const [alertFilter, setAlertFilter] = useState('All');

  // ── appointments tab state ───────────────────────────────────────────────
  const [showAddApptForm, setShowAddApptForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ patient: '', patientId: '', time: '', type: '', doctor: '' });

  // ── messages tab state ───────────────────────────────────────────────────
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [msgInput, setMsgInput] = useState('');

  // ── reports tab state ────────────────────────────────────────────────────
  const [reportRange, setReportRange] = useState('1 Nov 2025 – 6 Nov 2025');

  // ── settings tab state ───────────────────────────────────────────────────
  const [settingsProfile, setSettingsProfile] = useState({ name: 'Nurse Priya', email: 'priya@hospital.com', phone: '+91 98765 43210' });
  const [notifToggles, setNotifToggles] = useState({ highBP: true, fallDetect: true, sos: true, heartRate: true, oxygen: true });

  // ── add vitals form (health records) ─────────────────────────────────────
  const [showAddVitalsForm, setShowAddVitalsForm] = useState(false);
  const [newVitals, setNewVitals] = useState({ bp: '', hr: '', temp: '', spo2: '' });

  // ── load patients from API on mount ──────────────────────────────────────
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const { data } = await getPatients();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(p => ({ ...p, id: p._id || p.id }));
          setPatients(prev => {
            const ids = new Set(prev.map(x => String(x.id)));
            const fresh = normalized.filter(p => !ids.has(String(p.id)));
            return [...prev, ...fresh];
          });
        }
      } catch (err) {
        console.error('Unable to fetch patients from API:', err);
      }
    };
    loadPatients();
  }, []);

  // ── derived counts ────────────────────────────────────────────────────────
  const criticalAlertsCount = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const medsDueCount = medications.filter(m => !m.given && m.upcoming).length;
  const tasksDoneCount = tasks.filter(t => t.status === 'Done').length;
  const unreadMsgCount = messages.filter(m => m.unread).length;

  // ── navigate to patient in patients tab ───────────────────────────────────
  const goToPatient = (patientId) => {
    setActiveTab('patients');
    setExpandedPatientId(patientId);
  };

  // ── navigate to health record for patient ────────────────────────────────
  const goToHealthRecord = (patient) => {
    setSelectedPatient(patient);
    setHrInnerTab('overview');
    setActiveTab('health-records');
  };

  // ── add task for patient ──────────────────────────────────────────────────
  const addTaskForPatient = (patient) => {
    const t = {
      id: Date.now(),
      title: `Check on – ${patient.name}`,
      patientId: patient.id,
      room: patient.room || 'N/A',
      time: '12:00 PM',
      priority: 'Medium',
      status: 'Pending',
    };
    setTasks(prev => [...prev, t]);
    setActiveTab('tasks');
  };

  // ── add medication for patient ────────────────────────────────────────────
  const addMedForPatient = (patient) => {
    const m = {
      id: Date.now(),
      name: 'New Medication',
      patient: patient.name,
      patientId: patient.id,
      dose: '1 Tablet',
      time: '12:00 PM',
      given: false,
      upcoming: true,
    };
    setMedications(prev => [...prev, m]);
    setActiveTab('medications');
  };

  // ── accept patient from find panel ───────────────────────────────────────
  const acceptPatient = async (ap) => {
    const patient = {
      id: Date.now(),
      name: ap.name, age: ap.age, gender: ap.gender,
      condition: ap.condition, careType: ap.careType,
      bp: 'N/A', hr: 'N/A', temp: 'N/A', spo2: 'N/A',
      status: 'Stable', room: 'TBD', lastVisit: 'Just now', nurse: 'Nurse Priya',
    };
    setPatients(prev => [...prev, patient]);
    try { await createPatient({ name: patient.name, age: patient.age, condition: patient.condition, status: 'stable' }); }
    catch (e) { console.error('API save failed:', e); }
    setShowFindPatients(false);
    setExpandedProfile(null);
  };

  // ── remove patient ────────────────────────────────────────────────────────
  const removePatient = async (id) => { // eslint-disable-line no-unused-vars
    setPatients(prev => prev.filter(p => p.id !== id));
    try { await deletePatient(id); } catch (e) { console.error(e); }
  };

  // ── mark medication given ─────────────────────────────────────────────────
  const markMedGiven = (id) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, given: true, upcoming: false } : m));
  };

  // ── mark task done ────────────────────────────────────────────────────────
  const markTaskDone = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Done' } : t));
  };

  // ── resolve alert ─────────────────────────────────────────────────────────
  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  // ── add medication form submit ────────────────────────────────────────────
  const submitAddMed = (e) => {
    e.preventDefault();
    const pt = patients.find(p => String(p.id) === String(newMed.patientId));
    if (!pt || !newMed.name) return;
    setMedications(prev => [...prev, {
      id: Date.now(), name: newMed.name, patient: pt.name, patientId: pt.id,
      dose: newMed.dose || '1 Tablet', time: newMed.time || '12:00 PM',
      given: false, upcoming: true,
    }]);
    setNewMed({ name: '', patientId: '', dose: '', time: '' });
    setShowAddMedForm(false);
  };

  // ── add task form submit ──────────────────────────────────────────────────
  const submitAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setTasks(prev => [...prev, {
      id: Date.now(), title: newTask.title,
      patientId: newTask.patientId ? Number(newTask.patientId) : null,
      room: newTask.room || 'N/A', time: newTask.time || '12:00 PM',
      priority: newTask.priority, status: 'Pending',
    }]);
    setNewTask({ title: '', patientId: '', room: '', time: '', priority: 'Medium' });
    setShowAddTaskForm(false);
  };

  // ── add appointment form submit ───────────────────────────────────────────
  const submitAddAppt = (e) => {
    e.preventDefault();
    if (!newAppt.patient || !newAppt.type) return;
    setAppointments(prev => [...prev, {
      id: Date.now(), patient: newAppt.patient,
      patientId: newAppt.patientId ? Number(newAppt.patientId) : null,
      time: newAppt.time || '12:00 PM', type: newAppt.type,
      doctor: newAppt.doctor || 'TBD', status: 'Upcoming',
    }]);
    setNewAppt({ patient: '', patientId: '', time: '', type: '', doctor: '' });
    setShowAddApptForm(false);
  };

  // ── send message ──────────────────────────────────────────────────────────
  const sendMessage = () => {
    if (!msgInput.trim() || !selectedConvo) return;
    setMessages(prev => prev.map(m =>
      m.id === selectedConvo.id ? { ...m, text: msgInput, unread: false } : m
    ));
    setMsgInput('');
  };

  // ── update vitals ─────────────────────────────────────────────────────────
  const submitVitals = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setPatients(prev => prev.map(p =>
      p.id === selectedPatient.id
        ? { ...p, bp: newVitals.bp || p.bp, hr: newVitals.hr || p.hr, temp: newVitals.temp || p.temp, spo2: newVitals.spo2 || p.spo2 }
        : p
    ));
    setSelectedPatient(prev => ({
      ...prev,
      bp: newVitals.bp || prev.bp, hr: newVitals.hr || prev.hr,
      temp: newVitals.temp || prev.temp, spo2: newVitals.spo2 || prev.spo2,
    }));
    setNewVitals({ bp: '', hr: '', temp: '', spo2: '' });
    setShowAddVitalsForm(false);
  };

  // ── sidebar width ─────────────────────────────────────────────────────────
  const sidebarWidth = sidebarExpanded ? 220 : 72;

  // ── filtered patients for patients tab ───────────────────────────────────
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.condition || '').toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredAvailable = AVAILABLE_PATIENTS.filter(p => {
    const q = findSearch.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q);
    const matchCare = careTypeFilter === 'All' || p.careType === careTypeFilter;
    return matchSearch && matchCare;
  });

  // ── filtered tasks ────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter(t => {
    if (taskTab === 'pending')   return t.status === 'Pending' || t.status === 'Active';
    if (taskTab === 'completed') return t.status === 'Done';
    return true;
  });

  // ── filtered alerts ───────────────────────────────────────────────────────
  const filteredAlerts = alerts.filter(a => {
    if (alertFilter === 'Critical')       return a.severity === 'critical';
    if (alertFilter === 'Patient Alerts') return !!a.patientId;
    if (alertFilter === 'System Alerts')  return !a.patientId;
    return true;
  });

  // ── severity icon ─────────────────────────────────────────────────────────
  const severityIcon = (s) => s === 'critical' ? '🔴' : s === 'high' ? '🟠' : '🟡';

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f7f7', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor: '#fff',
          borderRight: '1px solid #e8e8e8',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 16,
          paddingBottom: 16,
          position: 'fixed',
          top: 0, left: 0,
          height: '100vh',
          zIndex: 100,
          overflow: 'hidden',
          transition: 'width 0.25s ease, min-width 0.25s ease',
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          paddingLeft: sidebarExpanded ? 16 : 0,
          justifyContent: sidebarExpanded ? 'flex-start' : 'center',
          marginBottom: 24,
          transition: 'padding 0.25s ease',
        }}>
          <div style={{
            width: 40, height: 40, minWidth: 40, backgroundColor: '#111', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 18,
          }}>N</div>
          {sidebarExpanded && (
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>
              Nurse's Dashboard
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, width: '100%', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const active = activeTab === item.key;
            const badge = item.key === 'messages' && unreadMsgCount > 0 ? unreadMsgCount : null;
            return (
              <button
                key={item.key}
                title={!sidebarExpanded ? item.label : undefined}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  height: 44,
                  paddingLeft: sidebarExpanded ? 16 : 0,
                  paddingRight: sidebarExpanded ? 12 : 0,
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  backgroundColor: active ? '#111' : 'transparent',
                  color: active ? '#fff' : '#555',
                  transition: 'background 0.15s, padding 0.25s ease',
                  width: '100%', boxSizing: 'border-box',
                  whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                {sidebarExpanded && (
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                )}
                {badge && (
                  <span style={{
                    position: 'absolute', top: 8, right: sidebarExpanded ? 12 : 8,
                    backgroundColor: '#ef4444', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          title={!sidebarExpanded ? 'Logout' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 44,
            paddingLeft: sidebarExpanded ? 16 : 0,
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            border: 'none', cursor: 'pointer', borderRadius: 8,
            backgroundColor: 'transparent', color: '#888',
            transition: 'padding 0.25s ease',
            width: '100%', boxSizing: 'border-box',
            whiteSpace: 'nowrap', overflow: 'hidden',
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>↩</span>
          {sidebarExpanded && <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>}
        </button>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left 0.25s ease',
      }}>

        {/* ── TOP HEADER ── */}
        <header style={{
          backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8',
          padding: '14px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>Good Evening, Nurse Priya 👋</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Here's your patient overview for today.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#888' }}>Current Shift</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>08:00 PM – 10:00 PM</div>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#555', position: 'relative' }}
            >
              🔔
              {criticalAlertsCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  backgroundColor: '#ef4444', color: '#fff',
                  borderRadius: '50%', width: 16, height: 16,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{criticalAlertsCount}</span>
              )}
            </button>
            <div style={{
              ...avatarCircle('#111', 36),
              fontSize: 14, cursor: 'default',
            }}>P</div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main style={{ padding: '28px 32px', flex: 1 }}>

          {/* ════════════════════════════════════════════════════════════════
              TAB: DASHBOARD
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '👥', label: 'Assigned Patients', value: 12, tab: null },
                  { icon: '🔴', label: 'Critical Alerts',   value: criticalAlertsCount, tab: 'alerts' },
                  { icon: '💊', label: 'Medications Due',   value: medsDueCount, tab: 'medications' },
                  { icon: '✅', label: 'Tasks Done',        value: tasksDoneCount, tab: 'tasks' },
                ].map(s => (
                  <div
                    key={s.label}
                    onClick={() => s.tab && setActiveTab(s.tab)}
                    style={{
                      ...card,
                      cursor: s.tab ? 'pointer' : 'default',
                      transition: 'box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { if (s.tab) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{s.label}</div>
                    {s.tab && <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>Click to view →</div>}
                  </div>
                ))}
              </div>

              {/* Two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* LEFT: My Patients */}
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={sectionTitle}>My Patients</div>
                    <button onClick={() => setActiveTab('patients')} style={outlineBtn}>View All →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {patients.slice(0, 5).map(p => {
                      const sb = statusBadge(p.status);
                      return (
                        <div key={p.id} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8,
                        }}>
                          <div style={avatarCircle('#111', 34)}>{getInitial(p.name)}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#888' }}>{p.age}y · {p.condition}</div>
                            <div style={{ fontSize: 11, color: '#aaa' }}>BP: {p.bp} · HR: {p.hr}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                              backgroundColor: sb.bg, color: sb.color, border: sb.border || 'none',
                              whiteSpace: 'nowrap',
                            }}>{p.status}</span>
                            <div style={{ fontSize: 10, color: '#aaa' }}>Last: {p.lastVisit}</div>
                          </div>
                          <button
                            onClick={() => addTaskForPatient(p)}
                            style={{ ...blackBtn, padding: '5px 10px', fontSize: 11, whiteSpace: 'nowrap' }}
                          >+ Task</button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT: Today's Schedule */}
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={sectionTitle}>Today's Schedule</div>
                    <button onClick={() => setActiveTab('appointments')} style={outlineBtn}>View Calendar →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {tasks.slice(0, 5).map(t => {
                      const pt = patients.find(p => p.id === t.patientId);
                      const pb = priorityBadge(t.priority);
                      return (
                        <div key={t.id} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8,
                        }}>
                          <div style={{ fontSize: 12, color: '#888', minWidth: 60 }}>{t.time}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                            <div style={{ fontSize: 11, color: '#888' }}>
                              {pt ? (
                                <span
                                  onClick={() => goToPatient(t.patientId)}
                                  style={{ cursor: 'pointer', textDecoration: 'underline', color: '#555' }}
                                >{pt.name}</span>
                              ) : 'General'} · Room {t.room}
                            </div>
                          </div>
                          <span style={{
                            padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                            backgroundColor: pb.bg, color: pb.color, border: pb.border || 'none',
                          }}>{t.priority}</span>
                          <span style={{
                            padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                            backgroundColor: t.status === 'Done' ? '#f0fdf4' : '#f9fafb',
                            color: t.status === 'Done' ? '#15803d' : '#6b7280',
                          }}>{t.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom row: Medications Due + Critical Alerts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Medications Due */}
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={sectionTitle}>Medications Due</div>
                    <button onClick={() => setActiveTab('medications')} style={outlineBtn}>View All →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {medications.filter(m => !m.given && m.upcoming).slice(0, 3).map(m => (
                      <div key={m.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', border: '1px solid #e8e8e8', borderRadius: 8,
                      }}>
                        <span style={{ fontSize: 18 }}>💊</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{m.patient} · {m.time}</div>
                        </div>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                          backgroundColor: '#fef9c3', color: '#a16207',
                        }}>Due</span>
                      </div>
                    ))}
                    {medications.filter(m => !m.given && m.upcoming).length === 0 && (
                      <div style={{ color: '#aaa', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>All medications given ✓</div>
                    )}
                  </div>
                </div>

                {/* Critical Alerts */}
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={sectionTitle}>Critical Alerts</div>
                    <button onClick={() => setActiveTab('alerts')} style={outlineBtn}>View All →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {alerts.filter(a => !a.resolved).slice(0, 3).map(a => (
                      <div key={a.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', border: '1px solid #e8e8e8', borderRadius: 8,
                      }}>
                        <span style={{ fontSize: 16 }}>{severityIcon(a.severity)}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{a.type}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{a.patient} · {a.time}</div>
                        </div>
                        <button
                          onClick={() => resolveAlert(a.id)}
                          style={{ ...outlineBtn, fontSize: 11, padding: '4px 10px' }}
                        >Resolve</button>
                      </div>
                    ))}
                    {alerts.filter(a => !a.resolved).length === 0 && (
                      <div style={{ color: '#aaa', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>No active alerts ✓</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: PATIENTS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'patients' && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input
                  style={{ ...formInput, flex: 1 }}
                  type="text"
                  placeholder="Search patients by name or condition..."
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                />
                <button style={{ ...outlineBtn, padding: '9px 18px' }}>Filter</button>
                <button
                  onClick={() => setShowFindPatients(!showFindPatients)}
                  style={blackBtn}
                >🔍 Find Patients</button>
              </div>

              {/* Find Patients panel */}
              {showFindPatients && (
                <div style={{ ...card, marginBottom: 20 }}>
                  <div style={sectionTitle}>Find Patients</div>
                  <input
                    style={{ ...formInput, marginBottom: 12 }}
                    type="text"
                    placeholder="Search by name, location, or condition..."
                    value={findSearch}
                    onChange={e => setFindSearch(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    {CARE_TYPE_FILTERS.map(f => (
                      <button key={f} onClick={() => setCareTypeFilter(f)} style={pillBtn(careTypeFilter === f)}>{f}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredAvailable.map(ap => (
                      <div key={ap.id}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px', border: '1px solid #e8e8e8',
                          borderRadius: expandedProfile === ap.id ? '8px 8px 0 0' : 8,
                          backgroundColor: '#fafafa',
                        }}>
                          <div style={avatarCircle('#555', 40)}>{getInitial(ap.name)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{ap.name} · {ap.age} yrs · {ap.gender}</div>
                            <div style={{ fontSize: 12, color: '#888' }}>◎ {ap.location}</div>
                          </div>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: '#f3f4f6', color: '#374151' }}>{ap.condition}</span>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: '#111', color: '#fff' }}>{ap.careType}</span>
                          <button
                            onClick={() => setExpandedProfile(expandedProfile === ap.id ? null : ap.id)}
                            style={outlineBtn}
                          >View Profile</button>
                        </div>
                        {expandedProfile === ap.id && (
                          <div style={{
                            border: '1px solid #e8e8e8', borderTop: 'none',
                            borderRadius: '0 0 8px 8px', padding: '16px 20px', backgroundColor: '#fff',
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                              {[['Name', ap.name], ['Age', `${ap.age} years`], ['Gender', ap.gender], ['Location', ap.location], ['Condition', ap.condition], ['Care Type', ap.careType]].map(([k, v]) => (
                                <div key={k}>
                                  <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{k}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{v}</div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => acceptPatient(ap)} style={blackBtn}>Accept Patient</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredAvailable.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#aaa', fontSize: 13 }}>No patients match your search.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Patient table */}
              <div style={card}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                        {['Patient', 'Age/Gender', 'Condition', 'Status', 'BP', 'HR', 'Room', 'Last Visit', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#888', fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map(p => {
                        const sb = statusBadge(p.status);
                        const isExpanded = expandedPatientId === p.id;
                        return (
                          <>
                            <tr
                              key={p.id}
                              style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: isExpanded ? '#fafafa' : '#fff' }}
                            >
                              <td style={{ padding: '12px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={avatarCircle('#111', 32)}>{getInitial(p.name)}</div>
                                  <span style={{ fontWeight: 600, color: '#111' }}>{p.name}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px 12px', color: '#555' }}>{p.age} / {p.gender}</td>
                              <td style={{ padding: '12px 12px', color: '#555' }}>{p.condition}</td>
                              <td style={{ padding: '12px 12px' }}>
                                <span style={{
                                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                  backgroundColor: sb.bg, color: sb.color, border: sb.border || 'none',
                                  whiteSpace: 'nowrap',
                                }}>{p.status}</span>
                              </td>
                              <td style={{ padding: '12px 12px', color: '#555' }}>{p.bp}</td>
                              <td style={{ padding: '12px 12px', color: '#555' }}>{p.hr}</td>
                              <td style={{ padding: '12px 12px', color: '#555' }}>{p.room}</td>
                              <td style={{ padding: '12px 12px', color: '#888', fontSize: 12 }}>{p.lastVisit}</td>
                              <td style={{ padding: '12px 12px' }}>
                                <button
                                  onClick={() => setExpandedPatientId(isExpanded ? null : p.id)}
                                  style={blackBtn}
                                >{isExpanded ? 'Close' : 'View'}</button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr key={`${p.id}-detail`}>
                                <td colSpan={9} style={{ padding: '0 12px 16px 12px', backgroundColor: '#fafafa' }}>
                                  <div style={{ border: '1px solid #e8e8e8', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                                    {/* Vitals grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                                      {[['Blood Pressure', p.bp, '🩺'], ['Heart Rate', p.hr, '❤️'], ['Temperature', p.temp, '🌡️'], ['SpO2', p.spo2, '💨']].map(([label, val, icon]) => (
                                        <div key={label} style={{ ...card, padding: '12px 16px', textAlign: 'center' }}>
                                          <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                                          <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{val}</div>
                                          <div style={{ fontSize: 11, color: '#888' }}>{label}</div>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Info row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                                      {[['Condition', p.condition], ['Room', p.room], ['Assigned Nurse', p.nurse]].map(([k, v]) => (
                                        <div key={k}>
                                          <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{k}</div>
                                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{v}</div>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                      <button onClick={() => addTaskForPatient(p)} style={blackBtn}>+ Add Task</button>
                                      <button onClick={() => addMedForPatient(p)} style={blackBtn}>+ Add Medication</button>
                                      <button onClick={() => goToHealthRecord(p)} style={outlineBtn}>View Health Record →</button>
                                      <button onClick={() => setExpandedPatientId(null)} style={{ ...outlineBtn, color: '#888', borderColor: '#e8e8e8' }}>Close</button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredPatients.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 14 }}>No patients found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: MEDICATIONS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'medications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['due', 'Due Today'], ['all', 'All Medicines'], ['history', 'History']].map(([key, label]) => (
                    <button key={key} onClick={() => setMedTab(key)} style={pillBtn(medTab === key)}>{label}</button>
                  ))}
                </div>
                <button onClick={() => setShowAddMedForm(!showAddMedForm)} style={blackBtn}>+ Add Medication</button>
              </div>

              {/* Add Medication inline form */}
              {showAddMedForm && (
                <div style={{ ...card, marginBottom: 20 }}>
                  <div style={sectionTitle}>Add Medication</div>
                  <form onSubmit={submitAddMed}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Patient</label>
                        <select
                          style={formSelect}
                          value={newMed.patientId}
                          onChange={e => setNewMed(prev => ({ ...prev, patientId: e.target.value }))}
                          required
                        >
                          <option value="">Select patient...</option>
                          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Medicine Name</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. Aspirin 75mg"
                          value={newMed.name}
                          onChange={e => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Dose</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. 1 Tablet"
                          value={newMed.dose}
                          onChange={e => setNewMed(prev => ({ ...prev, dose: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Time</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. 08:00 AM"
                          value={newMed.time}
                          onChange={e => setNewMed(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" style={blackBtn}>Add Medication</button>
                      <button type="button" onClick={() => setShowAddMedForm(false)} style={outlineBtn}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Medication list */}
              <div style={card}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {(() => {
                    const list = medTab === 'due'
                      ? medications.filter(m => !m.given && m.upcoming)
                      : medTab === 'history'
                      ? medications.filter(m => m.given)
                      : medications;
                    if (list.length === 0) {
                      return <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 14 }}>No medications in this category.</div>;
                    }
                    return list.map((m, idx) => (
                      <div key={m.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px',
                        borderBottom: idx < list.length - 1 ? '1px solid #f3f4f6' : 'none',
                        opacity: m.given ? 0.55 : 1,
                      }}>
                        <div style={{ fontSize: 12, color: '#888', minWidth: 72, fontWeight: 600 }}>{m.time}</div>
                        <span style={{ fontSize: 22 }}>💊</span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: 700, fontSize: 14, color: '#111',
                            textDecoration: m.given ? 'line-through' : 'none',
                          }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{m.dose}</div>
                        </div>
                        <button
                          onClick={() => { setActiveTab('patients'); setExpandedPatientId(m.patientId); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#555', textDecoration: 'underline', padding: 0 }}
                        >{m.patient}</button>
                        {!m.given ? (
                          <button onClick={() => markMedGiven(m.id)} style={blackBtn}>Mark as Given</button>
                        ) : (
                          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: '#f0fdf4', color: '#15803d' }}>Given ✓</span>
                        )}
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#aaa' }}>⋮</button>
                      </div>
                    ));
                  })()}
                </div>
                <div style={{ borderTop: '1px solid #e8e8e8', padding: '12px 16px', fontSize: 12, color: '#888' }}>
                  Showing {medTab === 'due' ? medications.filter(m => !m.given && m.upcoming).length : medTab === 'history' ? medications.filter(m => m.given).length : medications.length} of {medications.length} medications
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: APPOINTMENTS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'appointments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button style={{ ...outlineBtn, padding: '8px 14px' }}>‹</button>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Today, 6 Mar 2025</span>
                  <button style={{ ...outlineBtn, padding: '8px 14px' }}>›</button>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={outlineBtn}>View Calendar</button>
                  <button onClick={() => setShowAddApptForm(!showAddApptForm)} style={blackBtn}>+ Add Appointment</button>
                </div>
              </div>

              {/* Add Appointment inline form */}
              {showAddApptForm && (
                <div style={{ ...card, marginBottom: 20 }}>
                  <div style={sectionTitle}>Add Appointment</div>
                  <form onSubmit={submitAddAppt}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Patient</label>
                        <select
                          style={formSelect}
                          value={newAppt.patientId}
                          onChange={e => {
                            const pt = patients.find(p => String(p.id) === e.target.value);
                            setNewAppt(prev => ({ ...prev, patientId: e.target.value, patient: pt ? pt.name : '' }));
                          }}
                          required
                        >
                          <option value="">Select patient...</option>
                          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Appointment Type</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. General Checkup"
                          value={newAppt.type}
                          onChange={e => setNewAppt(prev => ({ ...prev, type: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Doctor</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. Dr. Anjali Verma"
                          value={newAppt.doctor}
                          onChange={e => setNewAppt(prev => ({ ...prev, doctor: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Time</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. 10:00 AM"
                          value={newAppt.time}
                          onChange={e => setNewAppt(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" style={blackBtn}>Add Appointment</button>
                      <button type="button" onClick={() => setShowAddApptForm(false)} style={outlineBtn}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Appointment list */}
              <div style={card}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {appointments.map((a, idx) => {
                    // const pt = patients.find(p => p.id === a.patientId); // reserved for future use
                    return (
                      <div key={a.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px',
                        borderBottom: idx < appointments.length - 1 ? '1px solid #f3f4f6' : 'none',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#888', minWidth: 72 }}>{a.time}</div>
                        <div style={avatarCircle('#111', 36)}>{getInitial(a.patient)}</div>
                        <div style={{ flex: 1 }}>
                          <button
                            onClick={() => { setActiveTab('patients'); setExpandedPatientId(a.patientId); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#111', padding: 0, textAlign: 'left' }}
                          >{a.patient}</button>
                          <div style={{ fontSize: 12, color: '#888' }}>{a.type}</div>
                        </div>
                        <div style={{ fontSize: 13, color: '#555' }}>{a.doctor}</div>
                        <span style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          backgroundColor: a.status === 'Completed' ? '#111' : '#fff',
                          color: a.status === 'Completed' ? '#fff' : '#374151',
                          border: a.status === 'Completed' ? 'none' : '1.5px solid #e8e8e8',
                        }}>{a.status}</span>
                        {a.status === 'Upcoming' && (
                          <button
                            onClick={() => setAppointments(prev => prev.map(x => x.id === a.id ? { ...x, status: 'Completed' } : x))}
                            style={{ ...outlineBtn, fontSize: 11 }}
                          >Mark Done</button>
                        )}
                      </div>
                    );
                  })}
                  {appointments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 14 }}>No appointments scheduled.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: HEALTH RECORDS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'health-records' && (
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

              {/* Left panel: patient list */}
              <div style={{ width: '35%', minWidth: 240, flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input
                    style={{ ...formInput, flex: 1 }}
                    type="text"
                    placeholder="Search patients..."
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                  />
                  <button style={{ ...outlineBtn, padding: '9px 14px' }}>Filter</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {filteredPatients.map(p => {
                    const isSelected = selectedPatient && selectedPatient.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => { setSelectedPatient(p); setHrInnerTab('overview'); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '12px 14px',
                          border: `1.5px solid ${isSelected ? '#111' : '#e8e8e8'}`,
                          borderRadius: 8,
                          backgroundColor: isSelected ? '#111' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={avatarCircle(isSelected ? '#fff' : '#111', 34)}>
                          <span style={{ color: isSelected ? '#111' : '#fff' }}>{getInitial(p.name)}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: isSelected ? '#fff' : '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: isSelected ? '#ccc' : '#888' }}>{p.age}y · {p.condition}</div>
                        </div>
                        <div style={{ fontSize: 11, color: isSelected ? '#ccc' : '#aaa' }}>Rm {p.room}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right panel: record detail */}
              <div style={{ flex: 1 }}>
                {!selectedPatient ? (
                  <div style={{ ...card, textAlign: 'center', padding: '80px 40px' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>Select a patient to view their health record</div>
                    <div style={{ fontSize: 13, color: '#aaa' }}>Choose a patient from the list on the left.</div>
                  </div>
                ) : (
                  <div style={card}>
                    {/* Patient info header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e8e8e8' }}>
                      <div style={avatarCircle('#111', 52)}>{getInitial(selectedPatient.name)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{selectedPatient.name}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{selectedPatient.age} yrs · {selectedPatient.gender} · ID: PT-{selectedPatient.id}</div>
                        <div style={{ fontSize: 12, color: '#aaa' }}>Assigned: {selectedPatient.nurse}</div>
                      </div>
                      <button onClick={() => setShowAddVitalsForm(!showAddVitalsForm)} style={blackBtn}>+ Add New Record</button>
                    </div>

                    {/* Add vitals inline form */}
                    {showAddVitalsForm && (
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 16, marginBottom: 16, backgroundColor: '#fafafa' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 12 }}>Add Vitals</div>
                        <form onSubmit={submitVitals}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                            {[['bp', 'Blood Pressure', 'e.g. 120/80'], ['hr', 'Heart Rate', 'e.g. 80 bpm'], ['temp', 'Temperature', 'e.g. 98.6°F'], ['spo2', 'SpO2', 'e.g. 98%']].map(([key, label, ph]) => (
                              <div key={key}>
                                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>{label}</label>
                                <input
                                  style={formInput}
                                  type="text"
                                  placeholder={ph}
                                  value={newVitals[key]}
                                  onChange={e => setNewVitals(prev => ({ ...prev, [key]: e.target.value }))}
                                />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" style={blackBtn}>Save Vitals</button>
                            <button type="button" onClick={() => setShowAddVitalsForm(false)} style={outlineBtn}>Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Inner tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                      {['overview', 'vitals', 'history', 'documents', 'notes'].map(t => (
                        <button key={t} onClick={() => setHrInnerTab(t)} style={pillBtn(hrInnerTab === t)}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Overview */}
                    {hrInnerTab === 'overview' && (
                      <div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Condition</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{selectedPatient.condition}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                          {[['Blood Pressure', selectedPatient.bp, '🩺'], ['Heart Rate', selectedPatient.hr, '❤️'], ['Temperature', selectedPatient.temp, '🌡️'], ['SpO2', selectedPatient.spo2, '💨']].map(([label, val, icon]) => (
                            <div key={label} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
                              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                              <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{val}</div>
                              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{label}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Last Visit</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{selectedPatient.lastVisit}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Next Visit</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Scheduled</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vitals */}
                    {hrInnerTab === 'vitals' && (
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                          {[['Blood Pressure', selectedPatient.bp, '🩺', 'Normal: 120/80'], ['Heart Rate', selectedPatient.hr, '❤️', 'Normal: 60–100 bpm'], ['Temperature', selectedPatient.temp, '🌡️', 'Normal: 97–99°F'], ['SpO2', selectedPatient.spo2, '💨', 'Normal: 95–100%']].map(([label, val, icon, norm]) => (
                            <div key={label} style={{ border: '1px solid #e8e8e8', borderRadius: 10, padding: '18px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 24 }}>{icon}</span>
                                <div>
                                  <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
                                  <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{val}</div>
                                </div>
                              </div>
                              <div style={{ fontSize: 11, color: '#aaa' }}>{norm}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* History */}
                    {hrInnerTab === 'history' && (
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {[
                            { date: selectedPatient.lastVisit, note: `Routine checkup. Condition: ${selectedPatient.condition}. BP: ${selectedPatient.bp}, HR: ${selectedPatient.hr}.` },
                            { date: 'Previous Visit', note: 'Follow-up visit. Patient stable. Medications reviewed.' },
                          ].map((h, i) => (
                            <div key={i} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '14px 16px' }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: '#111', marginBottom: 4 }}>{h.date}</div>
                              <div style={{ fontSize: 13, color: '#555' }}>{h.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {hrInnerTab === 'documents' && (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📁</div>
                        <div style={{ fontSize: 14 }}>No documents uploaded yet.</div>
                      </div>
                    )}

                    {/* Notes */}
                    {hrInnerTab === 'notes' && (
                      <div>
                        <textarea
                          style={{ ...formInput, height: 120, resize: 'vertical', fontFamily: 'inherit' }}
                          placeholder="Add notes about this patient..."
                        />
                        <button style={{ ...blackBtn, marginTop: 10 }}>Save Notes</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: TASKS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'tasks' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {[['pending', 'Pending'], ['completed', 'Completed'], ['all', 'All Tasks']].map(([key, label]) => (
                    <button key={key} onClick={() => setTaskTab(key)} style={pillBtn(taskTab === key)}>{label}</button>
                  ))}
                  <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>
                    {tasks.filter(t => t.status === 'Done').length}/{tasks.length} done
                  </span>
                </div>
                <button onClick={() => setShowAddTaskForm(!showAddTaskForm)} style={blackBtn}>+ Add Task</button>
              </div>

              {/* Add Task inline form */}
              {showAddTaskForm && (
                <div style={{ ...card, marginBottom: 20 }}>
                  <div style={sectionTitle}>Add Task</div>
                  <form onSubmit={submitAddTask}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Task Title</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. Check BP – Patient Name"
                          value={newTask.title}
                          onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Patient (optional)</label>
                        <select
                          style={formSelect}
                          value={newTask.patientId}
                          onChange={e => setNewTask(prev => ({ ...prev, patientId: e.target.value }))}
                        >
                          <option value="">No specific patient</option>
                          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Room</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. 101"
                          value={newTask.room}
                          onChange={e => setNewTask(prev => ({ ...prev, room: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Time</label>
                        <input
                          style={formInput}
                          type="text"
                          placeholder="e.g. 10:00 AM"
                          value={newTask.time}
                          onChange={e => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Priority</label>
                        <select
                          style={formSelect}
                          value={newTask.priority}
                          onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" style={blackBtn}>Add Task</button>
                      <button type="button" onClick={() => setShowAddTaskForm(false)} style={outlineBtn}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Task list */}
              <div style={card}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 14 }}>No tasks in this category.</div>
                  ) : filteredTasks.map((t, idx) => {
                    const pt = patients.find(p => p.id === t.patientId);
                    const pb = priorityBadge(t.priority);
                    const isDone = t.status === 'Done';
                    return (
                      <div key={t.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px',
                        borderBottom: idx < filteredTasks.length - 1 ? '1px solid #f3f4f6' : 'none',
                        opacity: isDone ? 0.6 : 1,
                      }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          backgroundColor: pb.bg, color: pb.color, border: pb.border || 'none',
                          whiteSpace: 'nowrap',
                        }}>{t.priority}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontWeight: 600, fontSize: 14, color: '#111',
                            textDecoration: isDone ? 'line-through' : 'none',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{t.title}</div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                            {pt ? (
                              <button
                                onClick={() => goToPatient(t.patientId)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#555', textDecoration: 'underline', padding: 0 }}
                              >{pt.name}</button>
                            ) : 'General'} · Room {t.room} · {t.time}
                          </div>
                        </div>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          backgroundColor: isDone ? '#f0fdf4' : t.status === 'Active' ? '#eff6ff' : '#f9fafb',
                          color: isDone ? '#15803d' : t.status === 'Active' ? '#1d4ed8' : '#6b7280',
                        }}>{t.status}</span>
                        {!isDone && (
                          <button onClick={() => markTaskDone(t.id)} style={blackBtn}>Mark Done</button>
                        )}
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#aaa' }}>⋮</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: ALERTS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'alerts' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['All', 'Critical', 'Patient Alerts', 'System Alerts'].map(f => (
                  <button key={f} onClick={() => setAlertFilter(f)} style={pillBtn(alertFilter === f)}>{f}</button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredAlerts.length === 0 ? (
                  <div style={{ ...card, textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 14 }}>No alerts in this category.</div>
                ) : filteredAlerts.map(a => (
                  <div key={a.id} style={{
                    ...card,
                    display: 'flex', alignItems: 'center', gap: 14,
                    opacity: a.resolved ? 0.55 : 1,
                    borderLeft: `4px solid ${a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f97316' : '#eab308'}`,
                  }}>
                    <span style={{ fontSize: 22 }}>{severityIcon(a.severity)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700, fontSize: 14, color: '#111',
                        textDecoration: a.resolved ? 'line-through' : 'none',
                      }}>{a.type}</div>
                      <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                        {a.patientId ? (
                          <button
                            onClick={() => goToPatient(a.patientId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#555', textDecoration: 'underline', padding: 0 }}
                          >{a.patient}</button>
                        ) : a.patient}
                        {' · '}{a.detail}
                      </div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{a.time}</div>
                    </div>
                    {a.resolved ? (
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: '#f0fdf4', color: '#15803d' }}>Resolved ✓</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setActiveTab('patients'); setExpandedPatientId(a.patientId); }}
                          style={outlineBtn}
                        >View</button>
                        <button onClick={() => resolveAlert(a.id)} style={blackBtn}>Resolve</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: REPORTS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'reports' && (
            <div>
              {/* Date range + generate */}
              <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: '#888' }}>Date Range:</span>
                <input
                  style={{ ...formInput, width: 240 }}
                  type="text"
                  value={reportRange}
                  onChange={e => setReportRange(e.target.value)}
                />
                <button style={blackBtn}>Generate Report</button>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '👥', label: 'Total Patients',    value: patients.length },
                  { icon: '✅', label: 'Completed Tasks',   value: tasks.filter(t => t.status === 'Done').length },
                  { icon: '💊', label: 'Medications Given', value: medications.filter(m => m.given).length },
                  { icon: '⚠️',  label: 'Alerts Reported',  value: alerts.length },
                ].map(s => (
                  <div key={s.label} style={card}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Reports */}
              <div style={card}>
                <div style={sectionTitle}>Recent Reports</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { name: 'Daily Patient Report',  date: '4 Nov 2025', size: '121 KB', icon: '📋' },
                    { name: 'Medication Report',     date: '4 Nov 2025', size: '121 KB', icon: '💊' },
                    { name: 'Alerts Summary',        date: '4 Nov 2025', size: '121 KB', icon: '⚠️' },
                    { name: 'Weekly Summary',        date: '1 Nov 2025', size: '121 KB', icon: '📊' },
                  ].map((r, idx, arr) => (
                    <div key={r.name} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      borderBottom: idx < arr.length - 1 ? '1px solid #f3f4f6' : 'none',
                    }}>
                      <span style={{ fontSize: 22 }}>{r.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{r.date} · {r.size}</div>
                      </div>
                      <button style={outlineBtn}>Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: MESSAGES
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'messages' && (
            <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 180px)', minHeight: 500 }}>

              {/* Left: conversation list */}
              <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 8 }}>Messages</div>
                {messages.map(m => {
                  const isSelected = selectedConvo && selectedConvo.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedConvo(m);
                        setMessages(prev => prev.map(x => x.id === m.id ? { ...x, unread: false } : x));
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 14px',
                        border: `1.5px solid ${isSelected ? '#111' : '#e8e8e8'}`,
                        borderRadius: 8,
                        backgroundColor: isSelected ? '#111' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        ...avatarCircle(isSelected ? '#fff' : '#111', 38),
                        color: isSelected ? '#111' : '#fff',
                        fontSize: 15,
                      }}>{m.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: isSelected ? '#fff' : '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.from}</div>
                        <div style={{ fontSize: 11, color: isSelected ? '#ccc' : '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.text}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <div style={{ fontSize: 10, color: isSelected ? '#ccc' : '#aaa' }}>{m.time}</div>
                        {m.unread && (
                          <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: isSelected ? '#fff' : '#111',
                            display: 'inline-block',
                          }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: chat view */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', ...card, padding: 0, overflow: 'hidden' }}>
                {!selectedConvo ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#aaa' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
                    <div style={{ fontSize: 14 }}>Select a conversation to start messaging</div>
                  </div>
                ) : (
                  <>
                    {/* Chat header */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={avatarCircle('#111', 38)}>{selectedConvo.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{selectedConvo.from}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{selectedConvo.role}</div>
                      </div>
                    </div>

                    {/* Messages area */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Incoming message */}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                        <div style={avatarCircle('#e8e8e8', 30)}>
                          <span style={{ color: '#555', fontSize: 12 }}>{selectedConvo.avatar}</span>
                        </div>
                        <div style={{
                          maxWidth: '70%', padding: '10px 14px',
                          backgroundColor: '#f3f4f6', borderRadius: '12px 12px 12px 2px',
                          fontSize: 13, color: '#111',
                        }}>{selectedConvo.text}</div>
                      </div>
                      {/* Sample reply */}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <div style={{
                          maxWidth: '70%', padding: '10px 14px',
                          backgroundColor: '#111', borderRadius: '12px 12px 2px 12px',
                          fontSize: 13, color: '#fff',
                        }}>Understood, I'll take care of it right away.</div>
                        <div style={avatarCircle('#111', 30)}>P</div>
                      </div>
                    </div>

                    {/* Input bar */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid #e8e8e8', display: 'flex', gap: 10 }}>
                      <input
                        style={{ ...formInput, flex: 1 }}
                        type="text"
                        placeholder="Type a message..."
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      />
                      <button onClick={sendMessage} style={blackBtn}>Send</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: SETTINGS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 720 }}>

              {/* Profile section */}
              <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                <div style={avatarCircle('#111', 64)}>P</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>Nurse Priya</div>
                  <div style={{ fontSize: 13, color: '#888' }}>Staff Nurse · Ward B</div>
                </div>
                <button style={outlineBtn}>Edit Profile</button>
              </div>

              {/* Personal Information */}
              <div style={{ ...card, marginBottom: 20 }}>
                <div style={sectionTitle}>Personal Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  {[['Full Name', 'name', 'text', 'Nurse Priya'], ['Email', 'email', 'email', 'priya@hospital.com'], ['Phone', 'phone', 'tel', '+91 98765 43210']].map(([label, key, type, ph]) => (
                    <div key={key} style={key === 'phone' ? { gridColumn: '1 / -1' } : {}}>
                      <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>{label}</label>
                      <input
                        style={formInput}
                        type={type}
                        value={settingsProfile[key] || ''}
                        placeholder={ph}
                        onChange={e => setSettingsProfile(prev => ({ ...prev, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <button style={blackBtn}>Save Changes</button>
              </div>

              {/* Change Password */}
              <div style={{ ...card, marginBottom: 20 }}>
                <div style={sectionTitle}>Change Password</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                    <div key={label}>
                      <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>{label}</label>
                      <input style={formInput} type="password" placeholder="••••••••" />
                    </div>
                  ))}
                </div>
                <button style={blackBtn}>Update Password</button>
              </div>

              {/* Notification Settings */}
              <div style={{ ...card, marginBottom: 20 }}>
                <div style={sectionTitle}>Notification Settings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    ['highBP',      'High Blood Pressure Alerts'],
                    ['fallDetect',  'Fall Detection Alerts'],
                    ['sos',         'SOS Alerts'],
                    ['heartRate',   'High Heart Rate Alerts'],
                    ['oxygen',      'Low Oxygen Level Alerts'],
                  ].map(([key, label]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, color: '#111' }}>{label}</span>
                      <button
                        onClick={() => setNotifToggles(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{
                          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                          backgroundColor: notifToggles[key] ? '#111' : '#e8e8e8',
                          position: 'relative', transition: 'background 0.2s',
                        }}
                      >
                        <span style={{
                          position: 'absolute', top: 3,
                          left: notifToggles[key] ? 22 : 3,
                          width: 18, height: 18, borderRadius: '50%',
                          backgroundColor: '#fff',
                          transition: 'left 0.2s',
                          display: 'block',
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shift Timings */}
              <div style={card}>
                <div style={sectionTitle}>Shift Timings</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['Current Shift', '08:00 PM – 10:00 PM'], ['Shift Type', 'Evening Shift'], ['Ward', 'Ward B'], ['Department', 'General Medicine']].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default NurseDashboard;
