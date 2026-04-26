import { useState, useEffect, useContext } from 'react';
import { getPatients, createPatient, deletePatient } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const NAV_ITEMS = [
  { key: 'patients',       icon: '👥', label: 'Patients' },
  { key: 'health-records', icon: '📋', label: 'Health Records' },
  { key: 'medicine',       icon: '💊', label: 'Medicine' },
  { key: 'appointments',   icon: '📅', label: 'Appointments' },
  { key: 'reports',        icon: '📄', label: 'Reports' },
  { key: 'emergency',      icon: '⚠', label: 'Emergency' },
  { key: 'chat',           icon: '💬', label: 'Chat' },
];

const NurseDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab]           = useState('patients');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [patients, setPatients]             = useState([]);
  const [healthRecords, setHealthRecords]   = useState([]);
  const [medTab, setMedTab]                 = useState('due');
  const [medicines, setMedicines]           = useState([
    { id: 1, name: 'Aspirin',    dosage: '75mg',  patient: 'Ramesh Kumar', schedule: '1 Tablet · After Lunch',  time: '01:00 PM', status: 'ongoing' },
    { id: 2, name: 'Metformin',  dosage: '500mg', patient: 'Radha Joshi',  schedule: '1 Tablet · After Dinner', time: '08:00 PM', status: 'ongoing' },
    { id: 3, name: 'Calcium',    dosage: '500mg', patient: 'Sunita Bhatia',schedule: '1 Tablet · Morning',      time: '08:00 AM', status: 'paused'  },
  ]);
  const [appointments, setAppointments]     = useState([
    { id: 1, patient: 'Ramesh Kumar',  time: '09:00 AM', type: 'General Checkup',    doctor: 'Dr. Anjali Verma', status: 'upcoming'  },
    { id: 2, patient: 'Radha Joshi',   time: '11:30 AM', type: 'Follow-up Visit',    doctor: 'Dr. Suresh Mehta', status: 'upcoming'  },
    { id: 3, patient: 'Sunita Bhatia', time: '02:00 PM', type: 'Blood Test Review',  doctor: 'Dr. Priya Singh',  status: 'upcoming'  },
  ]);
  const [newPatient, setNewPatient] = useState({
    name: '', age: '', condition: '', medications: '',
    bloodPressure: '', sugarLevel: '', heartRate: '', weight: ''
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const { data } = await getPatients();
        if (Array.isArray(data)) {
          const normalized = data.map(p => ({ ...p, id: p._id || p.id }));
          setPatients(normalized);
          localStorage.setItem('nursePatients', JSON.stringify(normalized));
        }
      } catch (error) {
        console.error('Unable to fetch nurse patients from API:', error);
        const stored = JSON.parse(localStorage.getItem('nursePatients') || '[]');
        if (stored.length) setPatients(stored);
      }
    };
    const storedRecords = JSON.parse(localStorage.getItem('nurseHealthRecords') || '[]');
    if (storedRecords.length) setHealthRecords(storedRecords);
    const storedAppointments = JSON.parse(localStorage.getItem('nurseAppointments') || '[]');
    if (storedAppointments.length) setAppointments(storedAppointments);
    loadPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const patient = {
      id: Date.now(), ...newPatient,
      status: 'stable', lastVisit: 'Just now', nextVisit: 'Tomorrow'
    };
    const updated = [...patients, patient];
    setPatients(updated);
    localStorage.setItem('nursePatients', JSON.stringify(updated));
    try {
      const saved = await createPatient({
        name: patient.name, age: patient.age, condition: patient.condition,
        medications: patient.medications, bloodPressure: patient.bloodPressure,
        sugarLevel: patient.sugarLevel, heartRate: patient.heartRate,
        weight: patient.weight, status: patient.status
      });
      const persisted = saved.data;
      const persistedPatients = updated.map(p =>
        p.id === patient.id ? { ...p, id: persisted._id, _id: persisted._id } : p
      );
      setPatients(persistedPatients);
      localStorage.setItem('nursePatients', JSON.stringify(persistedPatients));
    } catch (error) {
      console.error('Failed to save patient via API:', error);
    }
    setShowAddPatientForm(false);
    setNewPatient({ name: '', age: '', condition: '', medications: '', bloodPressure: '', sugarLevel: '', heartRate: '', weight: '' });
  };

  const removePatient = async (id) => {
    const filtered = patients.filter(p => p.id !== id);
    setPatients(filtered);
    localStorage.setItem('nursePatients', JSON.stringify(filtered));
    try { await deletePatient(id); }
    catch (error) { console.error('Unable to delete patient from backend:', error); }
  };

  // ── helpers ──────────────────────────────────────────────────────────────
  const getInitial = (name = '') => name.charAt(0).toUpperCase() || '?';

  const getStatusColor = (status) => {
    if (status === 'critical') return { bg: '#fee2e2', color: '#b91c1c' };
    if (status === 'stable')   return { bg: '#dcfce7', color: '#15803d' };
    return { bg: '#f3f4f6', color: '#374151' };
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f7f7', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 72, minWidth: 72, backgroundColor: '#fff',
        borderRight: '1px solid #e5e5e5', display: 'flex',
        flexDirection: 'column', alignItems: 'center',
        paddingTop: 16, paddingBottom: 16, position: 'fixed',
        top: 0, left: 0, height: '100vh', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          width: 40, height: 40, backgroundColor: '#111', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 24,
        }}>N</div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, width: '100%', alignItems: 'center' }}>
          {NAV_ITEMS.map(item => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                title={item.label}
                onClick={() => setActiveTab(item.key)}
                style={{
                  width: 48, height: 48, border: 'none', cursor: 'pointer',
                  borderRadius: 10, fontSize: 20, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: active ? '#111' : 'transparent',
                  color: active ? '#fff' : '#555',
                  transition: 'background 0.15s',
                }}
              >{item.icon}</button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <button title="Settings" style={sideBtn}>⚙</button>
          <button title="Logout" onClick={logout} style={sideBtn}>↩</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: 72, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top bar */}
        <header style={{
          backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5',
          padding: '16px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>Welcome back, Nurse 👋</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Here's your overview for today.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#888' }}>Current Shift</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>07:12 PM</div>
            </div>
            <button style={{
              background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#555',
            }}>🔔</button>
            <button onClick={logout} style={{
              padding: '8px 18px', backgroundColor: '#111', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Logout</button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '28px 32px', flex: 1 }}>

          {/* ── PATIENTS TAB ── */}
          {activeTab === 'patients' && (
            <div>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { icon: '👥', label: 'Total Patients',   value: patients.length },
                  { icon: '⚠',  label: 'Critical Alerts',  value: 0 },
                  { icon: '💊', label: 'Medications Due',  value: 0 },
                  { icon: '✓',  label: 'Tasks Done',       value: 0 },
                ].map(s => (
                  <div key={s.label} style={statCard}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Add patient button */}
              <button
                onClick={() => setShowAddPatientForm(!showAddPatientForm)}
                style={{
                  width: '100%', padding: '14px', backgroundColor: '#111', color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', marginBottom: 20,
                }}
              >{showAddPatientForm ? '− Cancel' : '+ Add New Patient'}</button>

              {/* Add patient form */}
              {showAddPatientForm && (
                <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 24, marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111' }}>Add Patient</div>
                  <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={formLabel}>Patient Name *</label>
                        <input style={formInput} type="text" value={newPatient.name} required
                          onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
                      </div>
                      <div>
                        <label style={formLabel}>Age *</label>
                        <input style={formInput} type="number" value={newPatient.age} required
                          onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label style={formLabel}>Health Condition *</label>
                      <input style={formInput} type="text" placeholder="e.g., High BP, Diabetes"
                        value={newPatient.condition} required
                        onChange={e => setNewPatient({ ...newPatient, condition: e.target.value })} />
                    </div>
                    <div>
                      <label style={formLabel}>Medications</label>
                      <textarea style={{ ...formInput, resize: 'vertical' }} rows={3}
                        placeholder="List current medications..."
                        value={newPatient.medications}
                        onChange={e => setNewPatient({ ...newPatient, medications: e.target.value })} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Initial Vitals</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {[
                        ['Blood Pressure', 'bloodPressure', '120/80'],
                        ['Sugar Level',    'sugarLevel',    '100 mg/dL'],
                        ['Heart Rate',     'heartRate',     '72 bpm'],
                        ['Weight',         'weight',        '70 kg'],
                      ].map(([lbl, key, ph]) => (
                        <div key={key}>
                          <label style={formLabel}>{lbl}</label>
                          <input style={formInput} type="text" placeholder={ph}
                            value={newPatient[key]}
                            onChange={e => setNewPatient({ ...newPatient, [key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <button type="submit" style={{
                      padding: '12px', backgroundColor: '#111', color: '#fff',
                      border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}>Add Patient</button>
                  </form>
                </div>
              )}

              {/* Patient list */}
              {patients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, color: '#ccc', marginBottom: 12 }}>👤</div>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>No patients assigned yet.</div>
                  <button
                    onClick={() => setShowAddPatientForm(true)}
                    style={{
                      padding: '10px 24px', backgroundColor: 'transparent', color: '#111',
                      border: '1.5px solid #111', borderRadius: 8, fontSize: 14,
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >+ Add Patient</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {patients.map((patient, idx) => {
                    const sc = getStatusColor(patient.status);
                    return (
                      <div key={patient.id} style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', backgroundColor: '#111',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 18, flexShrink: 0,
                        }}>{getInitial(patient.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{patient.name}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{patient.age} yrs · {patient.condition || 'N/A'}</div>
                          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                            ID: PT-{1001 + idx} &nbsp;·&nbsp; Last Update: 5 Mar 2025
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button style={{
                            padding: '7px 14px', backgroundColor: 'transparent', color: '#111',
                            border: '1.5px solid #ddd', borderRadius: 7, fontSize: 13,
                            fontWeight: 600, cursor: 'pointer',
                          }}>View Record →</button>
                          <span style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                            backgroundColor: sc.bg, color: sc.color, textTransform: 'capitalize',
                          }}>{patient.status || 'stable'}</span>
                          <button onClick={() => removePatient(patient.id)} style={{
                            background: 'none', border: 'none', color: '#ccc',
                            fontSize: 18, cursor: 'pointer', lineHeight: 1,
                          }}>×</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── HEALTH RECORDS TAB ── */}
          {activeTab === 'health-records' && (
            <div>
              {/* Search + filter */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input
                  style={{ ...formInput, flex: 1, margin: 0 }}
                  type="text"
                  placeholder="Search patient by name..."
                />
                <button style={{
                  padding: '10px 20px', backgroundColor: '#fff', color: '#111',
                  border: '1.5px solid #ddd', borderRadius: 8, fontSize: 13,
                  fontWeight: 600, cursor: 'pointer',
                }}>Filter</button>
              </div>

              {/* Records list */}
              {patients.length === 0 && healthRecords.length === 0 ? (
                <div style={emptyState}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                  <div style={{ color: '#888', fontSize: 14 }}>No health records found.</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(healthRecords.length ? healthRecords : patients).map((rec, idx) => (
                      <div key={rec.id || idx} style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={avatarCircle}>{getInitial(rec.name || rec.patientName)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{rec.name || rec.patientName}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{rec.age} yrs · {rec.condition || 'N/A'}</div>
                          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                            ID: PT-{1001 + idx} &nbsp;·&nbsp; Last Update: {rec.recordedAt || '5 Mar 2025'}
                          </div>
                        </div>
                        <button style={outlineBtn}>View Record →</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 13, color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Showing 1 to {Math.min(4, patients.length || healthRecords.length)} of {patients.length || healthRecords.length} records</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1].map(n => (
                        <button key={n} style={{
                          width: 32, height: 32, borderRadius: 6, border: '1.5px solid #111',
                          backgroundColor: '#111', color: '#fff', fontSize: 13, cursor: 'pointer',
                        }}>{n}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── MEDICINE TAB ── */}
          {activeTab === 'medicine' && (
            <div>
              {/* Tab pills */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[['due', 'Due Today'], ['all', 'All Medicines'], ['history', 'History']].map(([key, label]) => (
                  <button key={key} onClick={() => setMedTab(key)} style={{
                    padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid #111',
                    backgroundColor: medTab === key ? '#111' : '#fff',
                    color: medTab === key ? '#fff' : '#111',
                  }}>{label}</button>
                ))}
              </div>

              {/* Medicine list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {medicines.map(med => (
                  <div key={med.id} style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ ...avatarCircle, backgroundColor: '#f3f4f6', color: '#555', fontSize: 22 }}>💊</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{med.name} <span style={{ fontWeight: 400, color: '#888' }}>{med.dosage}</span></div>
                      <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{med.patient} · {med.schedule}</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#555', fontWeight: 600, marginRight: 12 }}>{med.time}</div>
                    <button style={{
                      padding: '8px 16px', backgroundColor: '#111', color: '#fff',
                      border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>Mark as Given</button>
                    <button style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' }}>⋮</button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: '#888' }}>
                Showing 1 to {medicines.length} of {medicines.length} medicines
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS TAB ── */}
          {activeTab === 'appointments' && (
            <div>
              {/* Date nav */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <button style={navArrowBtn}>{'<'}</button>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Today, 6 Mar 2025</span>
                <button style={navArrowBtn}>{'>'}</button>
              </div>

              {/* Appointment list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {appointments.map(app => (
                  <div key={app.id} style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#555', minWidth: 72 }}>{app.time}</div>
                    <div style={avatarCircle}>{getInitial(app.patient)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{app.patient}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{app.type} · {app.doctor}</div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: '1.5px solid #111', color: '#111', backgroundColor: '#fff',
                      textTransform: 'capitalize',
                    }}>{app.status}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: '#888' }}>
                Showing 1 to {appointments.length} of {appointments.length} appointments
              </div>
            </div>
          )}

          {/* ── REPORTS TAB ── */}
          {activeTab === 'reports' && (
            <div>
              {/* Date range + generate */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24 }}>
                <div style={{ ...formInput, margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8, color: '#555', fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
                  📅 1 Mar 2025 – 8 Mar 2025
                </div>
                <button style={{
                  padding: '10px 22px', backgroundColor: '#111', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>Generate</button>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Total Patients',    value: 0 },
                  { label: 'Completed Tasks',   value: 0 },
                  { label: 'Medications Given', value: 0 },
                  { label: 'Alerts Reported',   value: 0 },
                ].map(s => (
                  <div key={s.label} style={statCard}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent reports */}
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>Recent Reports</div>
              <div style={{ ...emptyState, border: '1px solid #e5e5e5', borderRadius: 12, backgroundColor: '#fff' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
                <div style={{ color: '#888', fontSize: 14, maxWidth: 340, textAlign: 'center' }}>
                  No reports generated yet. Select a date range and click 'Generate' to view reports.
                </div>
              </div>
            </div>
          )}

          {/* ── EMERGENCY TAB ── */}
          {activeTab === 'emergency' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>Emergency Contacts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: '🚑', name: 'Ambulance',          role: 'Emergency Medical Service' },
                  { icon: '👩‍⚕️', name: 'Dr. Anjali Verma',  role: 'On-Call Doctor' },
                  { icon: '🏥', name: 'Hospital Helpline',  role: 'City Care Hospital' },
                ].map(c => (
                  <div key={c.name} style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{c.role}</div>
                    </div>
                    <button style={outlineBtn}>Call</button>
                  </div>
                ))}
              </div>
              <button style={{
                width: '100%', padding: '14px', backgroundColor: '#111', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}>🚨 Emergency Alert</button>
            </div>
          )}

          {/* ── CHAT TAB ── */}
          {activeTab === 'chat' && (
            <div style={{ ...emptyState, minHeight: 320 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
              <div style={{ color: '#888', fontSize: 14 }}>Select a patient to message their family members</div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// ── shared style tokens ────────────────────────────────────────────────────
const sideBtn = {
  width: 40, height: 40, border: 'none', cursor: 'pointer',
  borderRadius: 8, fontSize: 18, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  backgroundColor: 'transparent', color: '#888',
};

const statCard = {
  backgroundColor: '#fff', border: '1px solid #e5e5e5',
  borderRadius: 12, padding: '20px 16px', textAlign: 'center',
};

const formLabel = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#333', marginBottom: 6,
};

const formInput = {
  width: '100%', padding: '10px 12px', border: '1px solid #ddd',
  borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
  outline: 'none', color: '#111',
};

const avatarCircle = {
  width: 44, height: 44, borderRadius: '50%', backgroundColor: '#111',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, fontSize: 18, flexShrink: 0,
};

const outlineBtn = {
  padding: '7px 14px', backgroundColor: 'transparent', color: '#111',
  border: '1.5px solid #ddd', borderRadius: 7, fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
};

const navArrowBtn = {
  width: 32, height: 32, border: '1.5px solid #ddd', borderRadius: 7,
  backgroundColor: '#fff', cursor: 'pointer', fontSize: 14, color: '#555',
};

const emptyState = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', padding: '60px 20px',
};

export default NurseDashboard;
