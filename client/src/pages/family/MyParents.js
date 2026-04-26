import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getParents, deleteParent } from '../../services/api';

const MyParents = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const { data } = await getParents();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(p => ({ ...p, id: p._id || p.id }));
          setParents(normalized);
          localStorage.setItem('myParents', JSON.stringify(normalized));
          return;
        }
      } catch (error) {
        console.error('Unable to fetch parents from API:', error);
      }
      const saved = JSON.parse(localStorage.getItem('myParents') || '[]');
      if (saved.length > 0) setParents(saved);
    };
    fetchParents();
  }, []);

  const handleDeleteParent = async (parentId) => {
    const filtered = parents.filter(p => (p._id || p.id).toString() !== parentId.toString());
    setParents(filtered);
    localStorage.setItem('myParents', JSON.stringify(filtered));
    try { await deleteParent(parentId); } catch (error) { console.error('Unable to delete parent on backend:', error); }
    setOpenMenuId(null);
  };

  return (
    <DashboardLayout>
      <div style={s.page}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Family Members 👥</h1>
            <p style={s.subtitle}>Stay connected with your loved ones</p>
          </div>
          <button style={s.addBtn} onClick={() => navigate('/family/add-parent')}>+ Add Member</button>
        </div>

        {parents.length === 0 ? (
          <div style={s.emptyState}>
            <span style={s.emptyIcon}>👥</span>
            <p style={s.emptyTitle}>No family members yet</p>
            <p style={s.emptyText}>Add your first family member to get started</p>
            <button style={s.addBtn} onClick={() => navigate('/family/add-parent')}>+ Add Member</button>
          </div>
        ) : (
          <div style={s.grid}>
            {parents.map(parent => {
              const pid = parent._id || parent.id;
              const initial = (parent.name || '?').charAt(0).toUpperCase();
              const isActive = parent.status !== 'offline';
              return (
                <div key={pid} style={s.card}>
                  <div style={s.menuWrapper}>
                    <button style={s.menuBtn} onClick={() => setOpenMenuId(openMenuId === pid ? null : pid)}>···</button>
                    {openMenuId === pid && (
                      <div style={s.menuDropdown}>
                        <button style={s.menuItem} onClick={() => { navigate('/family/add-parent', { state: { parent } }); setOpenMenuId(null); }}>Edit Profile</button>
                        <button style={{ ...s.menuItem, color: '#c00' }} onClick={() => handleDeleteParent(pid)}>Delete</button>
                      </div>
                    )}
                  </div>
                  <div style={s.avatar}>{initial}</div>
                  <p style={s.name}>{parent.name}</p>
                  <p style={s.relationship}>{parent.relationship ? parent.relationship.charAt(0).toUpperCase() + parent.relationship.slice(1) : 'Family Member'}</p>
                  <div style={s.statusRow}>
                    <span style={isActive ? s.dotActive : s.dotOffline} />
                    <span style={s.statusText}>{isActive ? 'Active' : 'Offline'}</span>
                  </div>
                  <div style={s.cardBtns}>
                    <button style={s.viewBtn} onClick={() => navigate('/family/live-care')}>View Health</button>
                    <button style={s.msgBtn}>Message</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={s.inviteRow}>
          <div style={s.inviteIcon}>👤</div>
          <div style={s.inviteText}>
            <p style={s.inviteTitle}>Invite Family Member</p>
            <p style={s.inviteSub}>Add someone to care and stay updated</p>
          </div>
          <span style={s.inviteArrow}>›</span>
        </div>
      </div>
    </DashboardLayout>
  );
};

const s = {
  page: { padding: '4px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1px solid #e8e8e8', flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888' },
  addBtn: { padding: '10px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  emptyState: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '60px 40px', textAlign: 'center', marginBottom: 20 },
  emptyIcon: { fontSize: 56, display: 'block', marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#888', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  card: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '24px 16px', textAlign: 'center', position: 'relative', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  menuWrapper: { position: 'absolute', top: 12, right: 12 },
  menuBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888', letterSpacing: 1, lineHeight: 1 },
  menuDropdown: { position: 'absolute', top: 24, right: 0, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 100, minWidth: 140, overflow: 'hidden' },
  menuItem: { display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, color: '#111', cursor: 'pointer' },
  avatar: { width: 72, height: 72, borderRadius: '50%', backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#555', margin: '0 auto 12px' },
  name: { fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 4 },
  relationship: { fontSize: 12, color: '#888', marginBottom: 12 },
  statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dotActive: { width: 10, height: 10, borderRadius: '50%', backgroundColor: '#111', display: 'inline-block' },
  dotOffline: { width: 10, height: 10, borderRadius: '50%', border: '2px solid #aaa', display: 'inline-block' },
  statusText: { fontSize: 12, color: '#555' },
  cardBtns: { display: 'flex', gap: 8 },
  viewBtn: { flex: 1, padding: '9px 0', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  msgBtn: { flex: 1, padding: '9px 0', backgroundColor: '#fff', color: '#111', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  inviteRow: { display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '16px 20px', cursor: 'pointer' },
  inviteIcon: { width: 44, height: 44, borderRadius: '50%', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  inviteText: { flex: 1 },
  inviteTitle: { fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 },
  inviteSub: { fontSize: 12, color: '#888' },
  inviteArrow: { fontSize: 22, color: '#aaa' },
};

export default MyParents;
