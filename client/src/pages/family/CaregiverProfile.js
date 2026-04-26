import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const CaregiverProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const caregiver = location.state?.caregiver;

  if (!caregiver) {
    return (
      <DashboardLayout>
        <div style={styles.container}>
          <p style={styles.errorText}>Caregiver not found</p>
          <button onClick={() => navigate('/family/search')} style={styles.backBtn}>
            Back to Search
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Derive a standard hourly rate from either API or local sample data.
  const normalizedHourlyRate = caregiver.pricePerHour ?? caregiver.price ?? caregiver.hourlyRate ?? 0;

  // Mock additional data
  const fullProfile = {
    ...caregiver,
    pricePerHour: normalizedHourlyRate,
    gender: 'Female',
    phone: '+91 98765 43210',
    email: `${caregiver.name.toLowerCase().replace(' ', '.')}@example.com`,
    address: `${caregiver.city}, India`,
    certifications: ['Certified Nursing Assistant', 'First Aid Certified', 'CPR Certified'],
    availableDays: 'Monday - Saturday',
    workingHours: '9 AM - 5 PM',
    serviceType: 'Home Visit',
    fullTime: false,
    hourlyRate: normalizedHourlyRate,
    dailyRate: normalizedHourlyRate * 8,
    weeklyPackage: normalizedHourlyRate * 8 * 6,
    completedServices: 45,
    reviews: [
      { id: 1, user: 'Priya Sharma', rating: 5, comment: 'Excellent caregiver! Very professional and caring.', date: '2 weeks ago' },
      { id: 2, user: 'Rajesh Kumar', rating: 4, comment: 'Good service. Very punctual.', date: '1 month ago' },
      { id: 3, user: 'Anita Desai', rating: 5, comment: 'Highly recommended! My mother loves her.', date: '2 months ago' },
    ]
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <button onClick={() => navigate('/family/search')} style={styles.backBtn}>
          ← Back to Search
        </button>

        <div style={styles.profileCard}>
          {/* Header Section */}
          <div style={styles.header}>
            <span style={styles.avatar}>{fullProfile.photo}</span>
            <div style={styles.headerInfo}>
              <h1 style={styles.name}>{fullProfile.name}</h1>
              <p style={styles.specialization}>{fullProfile.specialization}</p>
              <div style={styles.rating}>
                {'⭐'.repeat(Math.floor(fullProfile.rating))} {fullProfile.rating} ({fullProfile.reviews.length} reviews)
              </div>
            </div>
          </div>

          <div style={styles.body}>
            {/* 1. Basic Information */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>👤 Basic Information</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Full Name:</span>
                  <span style={styles.infoValue}>{fullProfile.name}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Age:</span>
                  <span style={styles.infoValue}>{fullProfile.age} years</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Gender:</span>
                  <span style={styles.infoValue}>{fullProfile.gender}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone Number:</span>
                  <span style={styles.infoValue}>{fullProfile.phone}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email ID:</span>
                  <span style={styles.infoValue}>{fullProfile.email}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Address:</span>
                  <span style={styles.infoValue}>{fullProfile.address}</span>
                </div>
              </div>
            </div>


            {/* 2. Professional Details */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💼 Professional Details</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Qualification:</span>
                  <span style={styles.infoValue}>{fullProfile.qualification}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Years of Experience:</span>
                  <span style={styles.infoValue}>{fullProfile.experience} years</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Specialization:</span>
                  <span style={styles.infoValue}>{fullProfile.specialization}</span>
                </div>
              </div>
              <div style={styles.certSection}>
                <span style={styles.infoLabel}>Certifications:</span>
                <div style={styles.certList}>
                  {fullProfile.certifications.map((cert, idx) => (
                    <span key={idx} style={styles.certBadge}>📜 {cert}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Services Provided */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🛠️ Services Provided</h3>
              <div style={styles.servicesList}>
                {fullProfile.services.map((service, idx) => (
                  <div key={idx} style={styles.serviceItem}>
                    <span style={styles.checkIcon}>✓</span>
                    <span style={styles.serviceText}>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Availability */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📅 Availability</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Available Days:</span>
                  <span style={styles.infoValue}>{fullProfile.availableDays}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Working Hours:</span>
                  <span style={styles.infoValue}>{fullProfile.workingHours}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Service Type:</span>
                  <span style={styles.infoValue}>{fullProfile.serviceType}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Employment Type:</span>
                  <span style={styles.infoValue}>{fullProfile.fullTime ? 'Full-time' : 'Part-time'}</span>
                </div>
              </div>
            </div>

            {/* 5. Location */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📍 Location</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>City:</span>
                  <span style={styles.infoValue}>{fullProfile.city}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Area/Locality:</span>
                  <span style={styles.infoValue}>{fullProfile.address}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Distance from you:</span>
                  <span style={styles.infoValue}>5 km</span>
                </div>
              </div>
            </div>

            {/* 6. Pricing */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💰 Pricing</h3>
              <div style={styles.pricingGrid}>
                <div style={styles.priceCard}>
                  <span style={styles.priceLabel}>Hourly Rate</span>
                  <span style={styles.priceValue}>₹{fullProfile.hourlyRate}/hour</span>
                </div>
                <div style={styles.priceCard}>
                  <span style={styles.priceLabel}>Daily Rate</span>
                  <span style={styles.priceValue}>₹{fullProfile.dailyRate}/day</span>
                </div>
                <div style={styles.priceCard}>
                  <span style={styles.priceLabel}>Weekly Package</span>
                  <span style={styles.priceValue}>₹{fullProfile.weeklyPackage}/week</span>
                </div>
              </div>
            </div>

            {/* 7. Ratings & Reviews */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>⭐ Ratings & Reviews</h3>
              <div style={styles.ratingsSummary}>
                <div style={styles.ratingBig}>
                  <span style={styles.ratingNumber}>{fullProfile.rating}</span>
                  <span style={styles.ratingStars}>{'⭐'.repeat(Math.floor(fullProfile.rating))}</span>
                  <span style={styles.ratingCount}>{fullProfile.completedServices} completed services</span>
                </div>
              </div>
              <div style={styles.reviewsList}>
                {fullProfile.reviews.map(review => (
                  <div key={review.id} style={styles.reviewCard}>
                    <div style={styles.reviewHeader}>
                      <span style={styles.reviewAuthor}>{review.user}</span>
                      <span style={styles.reviewRating}>{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p style={styles.reviewComment}>{review.comment}</p>
                    <span style={styles.reviewDate}>{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8. Booking/Contact Options */}
          <div style={styles.actions}>
            <button 
              style={styles.bookBtn}
              onClick={() => navigate('/family/booking', { state: { caregiver: fullProfile } })}
            >
              📅 Book Caregiver
            </button>
            <button style={styles.messageBtn}>
              💬 Message Caregiver
            </button>
            <button style={styles.callBtn}>
              📞 Call Caregiver
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  errorText: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    padding: '40px',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '32px',
    backgroundColor: '#f8f8f8',
    borderBottom: '1px solid #e0e0e0',
  },
  avatar: {
    fontSize: '80px',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  specialization: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '8px',
  },
  rating: {
    fontSize: '18px',
    color: '#1a1a1a',
    fontWeight: '600',
  },
  body: {
    padding: '32px',
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #f0f0f0',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '16px',
    color: '#1a1a1a',
    fontWeight: '600',
  },
  certSection: {
    marginTop: '20px',
  },
  certList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '12px',
  },
  certBadge: {
    padding: '8px 16px',
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  servicesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px',
  },
  serviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
  },
  checkIcon: {
    fontSize: '18px',
    color: '#4caf50',
    fontWeight: '700',
  },
  serviceText: {
    fontSize: '15px',
    color: '#333',
    fontWeight: '500',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  priceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
  },
  priceLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  priceValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  ratingsSummary: {
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  ratingBig: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  ratingNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  ratingStars: {
    fontSize: '24px',
  },
  ratingCount: {
    fontSize: '14px',
    color: '#666',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    padding: '20px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  reviewAuthor: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewRating: {
    fontSize: '16px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '8px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#999',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    padding: '24px 32px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
    flexWrap: 'wrap',
  },
  bookBtn: {
    flex: 1,
    minWidth: '200px',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  messageBtn: {
    flex: 1,
    minWidth: '200px',
    padding: '16px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  callBtn: {
    flex: 1,
    minWidth: '200px',
    padding: '16px',
    backgroundColor: '#4caf50',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default CaregiverProfile;
