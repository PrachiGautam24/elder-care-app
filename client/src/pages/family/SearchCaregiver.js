import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getCaregiverNeeds, createCaregiverNeed } from '../../services/api';

const SearchCaregiver = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState([]);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [postedNeeds, setPostedNeeds] = useState([]);
  const [needForm, setNeedForm] = useState({ careType: '', budget: '', description: '', location: '' });

  const allCaregivers = [
    { id: 1, name: 'Rita Sharma', price: 250, city: 'Mumbai', experience: 5, specialization: 'Elderly Care & Medication Support', rating: 4.5, reviews: 32, careTypes: ['elderly', 'medical'], category: 'Elder Care' },
    { id: 2, name: 'Priya Patel', price: 300, city: 'Delhi', experience: 8, specialization: 'Dementia Care & Personal Hygiene', rating: 4.8, reviews: 54, careTypes: ['dementia', 'elderly'], category: 'Nurse' },
    { id: 3, name: 'Anjali Verma', price: 280, city: 'Bangalore', experience: 4, specialization: 'Post-Operative Care', rating: 4.6, reviews: 28, careTypes: ['medical', 'physiotherapy'], category: 'Physiotherapist' },
    { id: 4, name: 'Sunita Reddy', price: 320, city: 'Hyderabad', experience: 6, specialization: "Alzheimer's Care", rating: 4.7, reviews: 41, careTypes: ['dementia', 'elderly'], category: 'Nurse' },
    { id: 5, name: 'Meera Singh', price: 270, city: 'Pune', experience: 5, specialization: 'Physiotherapy Support', rating: 4.4, reviews: 19, careTypes: ['physiotherapy', 'elderly'], category: 'Physiotherapist' },
    { id: 6, name: 'Kavita Joshi', price: 350, city: 'Chennai', experience: 10, specialization: 'Palliative Care', rating: 4.9, reviews: 67, careTypes: ['medical', 'elderly'], category: 'Nurse' },
    { id: 7, name: 'Deepa Kumar', price: 260, city: 'Kolkata', experience: 4, specialization: 'Diabetes Management', rating: 4.5, reviews: 22, careTypes: ['medical', 'elderly'], category: 'Elder Care' },
    { id: 8, name: 'Lakshmi Iyer', price: 290, city: 'Ahmedabad', experience: 7, specialization: 'Heart Care & Monitoring', rating: 4.6, reviews: 38, careTypes: ['medical', 'elderly'], category: 'Nurse' },
    { id: 9, name: 'Radha Nair', price: 310, city: 'Jaipur', experience: 6, specialization: 'Stroke Recovery Care', rating: 4.7, reviews: 45, careTypes: ['physiotherapy', 'medical'], category: 'Physiotherapist' },
    { id: 10, name: 'Geeta Desai', price: 200, city: 'Surat', experience: 3, specialization: 'Companionship & Daily Care', rating: 4.3, reviews: 14, careTypes: ['companionship', 'elderly'], category: 'Elder Care' },
  ];

  const [filteredCaregivers, setFilteredCaregivers] = useState(allCaregivers);

  useEffect(() => {
    const loadNeeds = async () => {
      try {
        const { data } = await getCaregiverNeeds();
        if (Array.isArray(data) && data.length > 0) {
          setPostedNeeds(data);
          const selected = data[data.length - 1];
          if (selected?.careType) setFilteredCaregivers(allCaregivers.filter(c => c.careTypes.includes(selected.careType)));
          return;
        }
      } catch (error) { console.error('Error fetching caregiver needs:', error); }
      const stored = JSON.parse(localStorage.getItem('caregiverNeeds') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setPostedNeeds(stored);
        const selected = stored[stored.length - 1];
        if (selected?.careType) setFilteredCaregivers(allCaregivers.filter(c => c.careTypes.includes(selected.careType)));
      }
    };
    loadNeeds();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePostNeed = async (e) => {
    e.preventDefault();
    const newNeed = { ...needForm, id: Date.now() };
    try {
      const { data } = await createCaregiverNeed({ careType: needForm.careType, budget: Number(needForm.budget), description: needForm.description, location: needForm.location });
      setPostedNeeds(prev => [...prev, data]);
      localStorage.setItem('caregiverNeeds', JSON.stringify([...postedNeeds, data]));
    } catch (error) {
      const fallback = [...postedNeeds, newNeed];
      setPostedNeeds(fallback);
      localStorage.setItem('caregiverNeeds', JSON.stringify(fallback));
    }
    if (needForm.careType) setFilteredCaregivers(allCaregivers.filter(c => c.careTypes.includes(needForm.careType)));
    setShowNeedForm(false);
    setNeedForm({ careType: '', budget: '', description: '', location: '' });
  };

  const handleRemoveNeed = (id) => {
    const updated = postedNeeds.filter(n => n.id !== id);
    setPostedNeeds(updated);
    if (updated.length === 0) setFilteredCaregivers(allCaregivers);
  };

  const filterChips = ['All', 'Nurse', 'Elder Care', 'Physiotherapist'];
  const dropdownChips = ['Experience ▾', 'Rating ▾', 'Availability ▾', 'Distance ▾'];

  const displayedCaregivers = filteredCaregivers.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.category === activeFilter;
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleLike = (id) => setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const renderStars = (rating) => '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  return (
    <DashboardLayout>
      <div style={s.page}>
        <div style={s.header}>
          <h1 style={s.title}>Find Caregiver</h1>
          <p style={s.subtitle}>Find trusted caregivers for your loved ones</p>
        </div>

        <div style={s.searchBar}>
          <span style={s.searchIcon}>🔍</span>
          <input type="text" placeholder="Search caregiver, nurse, therapist..." style={s.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <button style={s.filterIconBtn} onClick={() => setShowNeedForm(!showNeedForm)}>⚙</button>
        </div>

        <div style={s.chipsRow}>
          {filterChips.map(chip => (
            <button key={chip} style={activeFilter === chip ? s.chipActive : s.chip} onClick={() => setActiveFilter(chip)}>{chip}</button>
          ))}
          {dropdownChips.map(chip => <button key={chip} style={s.chipDropdown}>{chip}</button>)}
        </div>

        {showNeedForm && (
          <div style={s.needFormCard}>
            <p style={s.needFormTitle}>Post a Caregiver Need</p>
            <form onSubmit={handlePostNeed}>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Care Type</label>
                  <select style={s.formSelect} value={needForm.careType} onChange={e => setNeedForm({ ...needForm, careType: e.target.value })} required>
                    <option value="">Select...</option>
                    <option value="elderly">Elderly Care</option>
                    <option value="medical">Medical Nursing</option>
                    <option value="dementia">Dementia Care</option>
                    <option value="physiotherapy">Physiotherapy</option>
                    <option value="companionship">Companionship</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Budget (hourly ₹)</label>
                  <input type="number" placeholder="e.g., 250" style={s.formInput} value={needForm.budget} onChange={e => setNeedForm({ ...needForm, budget: e.target.value })} required />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Description</label>
                <textarea placeholder="Describe care needed..." style={s.formTextarea} value={needForm.description} onChange={e => setNeedForm({ ...needForm, description: e.target.value })} rows="3" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Location</label>
                <input type="text" placeholder="City, State" style={s.formInput} value={needForm.location} onChange={e => setNeedForm({ ...needForm, location: e.target.value })} required />
              </div>
              <div style={s.formActions}>
                <button type="submit" style={s.submitBtn}>Post Need</button>
                <button type="button" style={s.cancelBtn} onClick={() => setShowNeedForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {postedNeeds.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={s.sectionLabel}>Your Posted Needs</p>
            {postedNeeds.map(need => (
              <div key={need.id} style={s.postedNeedCard}>
                <div style={{ flex: 1 }}>
                  <p style={s.postedNeedType}>{need.careType}</p>
                  <p style={s.postedNeedDesc}>{need.description}</p>
                  <p style={s.postedNeedMeta}>₹{need.budget}/hr · {need.location}</p>
                </div>
                <button style={s.removeBtn} onClick={() => handleRemoveNeed(need.id)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={s.listSection}>
          <p style={s.sectionLabel}>{displayedCaregivers.length} Caregivers Available</p>
          <div style={s.list}>
            {displayedCaregivers.map(cg => (
              <div key={cg.id} style={s.card}>
                <div style={s.avatar}>{cg.name.charAt(0)}</div>
                <div style={s.cardMiddle}>
                  <div style={s.nameRow}>
                    <span style={s.cgName}>{cg.name}</span>
                    <span style={s.verifiedBadge}>✓</span>
                  </div>
                  <p style={s.cgSpec}>{cg.specialization} · {cg.experience}+ Years Exp.</p>
                  <div style={s.ratingRow}>
                    <span style={s.stars}>{renderStars(cg.rating)}</span>
                    <span style={s.ratingNum}>{cg.rating}</span>
                    <span style={s.reviewCount}>({cg.reviews})</span>
                    <span style={s.distance}>· {cg.city}</span>
                  </div>
                </div>
                <div style={s.cardRight}>
                  <div style={s.priceRow}>
                    <p style={s.price}>₹{cg.price}<span style={s.perHr}>/hr</span></p>
                    <button style={s.heartBtn} onClick={() => toggleLike(cg.id)}>{likedIds.includes(cg.id) ? '❤️' : '🤍'}</button>
                  </div>
                  <div style={s.actionBtns}>
                    <button style={s.viewBtn} onClick={() => navigate(`/family/profile/${cg.id}`, { state: { caregiver: cg } })}>View Profile</button>
                    <button style={s.bookBtn} onClick={() => navigate('/family/bookings', { state: { caregiver: cg } })}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const s = {
  page: { padding: '4px 0' },
  header: { backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 16, border: '1px solid #e8e8e8' },
  title: { fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888' },
  searchBar: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '10px 16px', marginBottom: 14 },
  searchIcon: { fontSize: 16, color: '#888', flexShrink: 0 },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#111', backgroundColor: 'transparent' },
  filterIconBtn: { padding: '6px 12px', backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
  chipsRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  chip: { padding: '7px 16px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, fontSize: 13, fontWeight: 500, color: '#555', cursor: 'pointer' },
  chipActive: { padding: '7px 16px', backgroundColor: '#111', border: '1px solid #111', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' },
  chipDropdown: { padding: '7px 16px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, fontSize: 13, fontWeight: 500, color: '#555', cursor: 'pointer' },
  needFormCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 20, marginBottom: 20 },
  needFormTitle: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 14 },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 },
  formGroup: { marginBottom: 12 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6 },
  formSelect: { width: '100%', padding: '9px 12px', backgroundColor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#111' },
  formInput: { width: '100%', padding: '9px 12px', backgroundColor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#111', boxSizing: 'border-box' },
  formTextarea: { width: '100%', padding: '9px 12px', backgroundColor: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, color: '#111', resize: 'vertical', boxSizing: 'border-box' },
  formActions: { display: 'flex', gap: 10, marginTop: 12 },
  submitBtn: { flex: 1, padding: 11, backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: 11, backgroundColor: 'transparent', color: '#111', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  postedNeedCard: { display: 'flex', alignItems: 'flex-start', gap: 12, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '14px 16px', marginBottom: 8 },
  postedNeedType: { fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2, textTransform: 'capitalize' },
  postedNeedDesc: { fontSize: 13, color: '#666', marginBottom: 4 },
  postedNeedMeta: { fontSize: 12, color: '#aaa' },
  removeBtn: { background: 'none', border: 'none', fontSize: 16, color: '#aaa', cursor: 'pointer', flexShrink: 0 },
  listSection: { marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: 600, color: '#888', marginBottom: 12 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { display: 'flex', alignItems: 'center', gap: 16, backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  avatar: { width: 52, height: 52, borderRadius: '50%', backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#555', flexShrink: 0 },
  cardMiddle: { flex: 1, minWidth: 0 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 },
  cgName: { fontSize: 15, fontWeight: 700, color: '#111' },
  verifiedBadge: { width: 18, height: 18, borderRadius: '50%', backgroundColor: '#111', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cgSpec: { fontSize: 12, color: '#666', marginBottom: 4 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 4 },
  stars: { fontSize: 12, color: '#f5a623' },
  ratingNum: { fontSize: 12, fontWeight: 600, color: '#111' },
  reviewCount: { fontSize: 12, color: '#888' },
  distance: { fontSize: 12, color: '#888' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 8 },
  price: { fontSize: 16, fontWeight: 700, color: '#111' },
  perHr: { fontSize: 12, fontWeight: 400, color: '#888' },
  heartBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' },
  actionBtns: { display: 'flex', gap: 8 },
  viewBtn: { padding: '7px 14px', backgroundColor: '#fff', color: '#111', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  bookBtn: { padding: '7px 14px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};

export default SearchCaregiver;
