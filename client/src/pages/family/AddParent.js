import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { addParent } from '../../services/api';

const AddParent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    relationship: '',
    phone: '',
    address: '',
    medicalConditions: [],
    otherCondition: '',
    takingMedications: '',
    medicationDetails: '',
    hasAllergies: '',
    allergyDetails: '',
    canWalk: '',
    dailyHelp: [],
    livesAlone: '',
    someoneAvailable: '',
    recentFall: '',
    emergencyContactName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    careType: []
  });

  const handleCheckbox = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingParents = JSON.parse(localStorage.getItem('myParents') || '[]');
    const newParent = {
      id: Date.now(),
      name: formData.fullName || 'Unknown',
      age: formData.age,
      gender: formData.gender,
      relationship: formData.relationship,
      phone: formData.phone,
      address: formData.address,
      healthConditions: formData.medicalConditions.filter(Boolean),
      otherCondition: formData.otherCondition,
      takingMedications: formData.takingMedications,
      medicationDetails: formData.medicationDetails,
      hasAllergies: formData.hasAllergies,
      allergyDetails: formData.allergyDetails,
      canWalk: formData.canWalk,
      dailyHelp: formData.dailyHelp,
      livesAlone: formData.livesAlone,
      someoneAvailable: formData.someoneAvailable,
      recentFall: formData.recentFall,
      emergencyContactName: formData.emergencyContactName,
      emergencyRelationship: formData.emergencyRelationship,
      emergencyPhone: formData.emergencyPhone,
      careType: formData.careType,
      createdAt: new Date().toISOString(),
    };

    // Persist in localStorage for immediate UI update and fallback
    localStorage.setItem('myParents', JSON.stringify([newParent, ...existingParents]));

    // Also sync with backend when possible
    try {
      const response = await addParent({
        name: newParent.name,
        age: newParent.age,
        gender: newParent.gender,
        relationship: newParent.relationship,
        phone: newParent.phone,
        address: newParent.address,
        healthConditions: newParent.healthConditions,
        otherCondition: newParent.otherCondition,
        takingMedications: newParent.takingMedications,
        medicationDetails: newParent.medicationDetails,
        hasAllergies: newParent.hasAllergies,
        allergyDetails: newParent.allergyDetails,
        canWalk: newParent.canWalk,
        dailyHelp: newParent.dailyHelp,
        livesAlone: newParent.livesAlone,
        someoneAvailable: newParent.someoneAvailable,
        recentFall: newParent.recentFall,
        emergencyContactName: newParent.emergencyContactName,
        emergencyRelationship: newParent.emergencyRelationship,
        emergencyPhone: newParent.emergencyPhone,
        careType: newParent.careType,
      });
      const savedParent = response.data;
      const realParent = { ...newParent, _id: savedParent._id, id: savedParent._id };
      const updatedList = [realParent, ...existingParents];
      localStorage.setItem('myParents', JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Unable to persist parent to server; using local storage fallback.', err);
    }

    // Reset form to clear fields after submit for better UX
    setFormData({
      fullName: '',
      age: '',
      gender: '',
      relationship: '',
      phone: '',
      address: '',
      medicalConditions: [],
      otherCondition: '',
      takingMedications: '',
      medicationDetails: '',
      hasAllergies: '',
      allergyDetails: '',
      canWalk: '',
      dailyHelp: [],
      livesAlone: '',
      someoneAvailable: '',
      recentFall: '',
      emergencyContactName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      careType: []
    });

    navigate('/family/my-parents');
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h1 style={styles.title}>Parent / Elder Information Form</h1>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* 1. Basic Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>1. Basic Details</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Age *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender *</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      />
                      Male
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      />
                      Female
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      />
                      Other
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Relationship with User *</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="relationship"
                      value="mother"
                      checked={formData.relationship === 'mother'}
                      onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    />
                    Mother
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="relationship"
                      value="father"
                      checked={formData.relationship === 'father'}
                      onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    />
                    Father
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="relationship"
                      value="grandparent"
                      checked={formData.relationship === 'grandparent'}
                      onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    />
                    Grandparent
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="relationship"
                      value="other"
                      checked={formData.relationship === 'other'}
                      onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    />
                    Other
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Address *</label>
                <textarea
                  style={styles.textarea}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* 2. Health Information */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>2. Health Information</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Do they have any medical conditions?</label>
                <div style={styles.checkboxGroup}>
                  {['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Arthritis', 'None'].map(condition => (
                    <label key={condition} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.medicalConditions.includes(condition)}
                        onChange={() => handleCheckbox('medicalConditions', condition)}
                      />
                      {condition}
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Other (please specify)"
                  style={styles.input}
                  value={formData.otherCondition}
                  onChange={(e) => setFormData({...formData, otherCondition: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Are they currently taking medications?</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="takingMedications"
                      value="yes"
                      checked={formData.takingMedications === 'yes'}
                      onChange={(e) => setFormData({...formData, takingMedications: e.target.value})}
                    />
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="takingMedications"
                      value="no"
                      checked={formData.takingMedications === 'no'}
                      onChange={(e) => setFormData({...formData, takingMedications: e.target.value})}
                    />
                    No
                  </label>
                </div>
                {formData.takingMedications === 'yes' && (
                  <textarea
                    placeholder="If yes, please specify medications..."
                    style={styles.textarea}
                    value={formData.medicationDetails}
                    onChange={(e) => setFormData({...formData, medicationDetails: e.target.value})}
                    rows="3"
                  />
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Do they have any allergies?</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="yes"
                      checked={formData.hasAllergies === 'yes'}
                      onChange={(e) => setFormData({...formData, hasAllergies: e.target.value})}
                    />
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="no"
                      checked={formData.hasAllergies === 'no'}
                      onChange={(e) => setFormData({...formData, hasAllergies: e.target.value})}
                    />
                    No
                  </label>
                </div>
                {formData.hasAllergies === 'yes' && (
                  <input
                    type="text"
                    placeholder="If yes, mention allergies..."
                    style={styles.input}
                    value={formData.allergyDetails}
                    onChange={(e) => setFormData({...formData, allergyDetails: e.target.value})}
                  />
                )}
              </div>
            </div>

            {/* 3. Mobility & Daily Activities */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>3. Mobility & Daily Activities</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Can they walk independently?</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="canWalk"
                      value="yes"
                      checked={formData.canWalk === 'yes'}
                      onChange={(e) => setFormData({...formData, canWalk: e.target.value})}
                    />
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="canWalk"
                      value="need-support"
                      checked={formData.canWalk === 'need-support'}
                      onChange={(e) => setFormData({...formData, canWalk: e.target.value})}
                    />
                    Need Support
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="canWalk"
                      value="cannot"
                      checked={formData.canWalk === 'cannot'}
                      onChange={(e) => setFormData({...formData, canWalk: e.target.value})}
                    />
                    Cannot Walk
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Do they require help with daily activities?</label>
                <div style={styles.checkboxGroup}>
                  {['Eating', 'Bathing', 'Dressing', 'Taking Medicines', 'No Help Needed'].map(activity => (
                    <label key={activity} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.dailyHelp.includes(activity)}
                        onChange={() => handleCheckbox('dailyHelp', activity)}
                      />
                      {activity}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Safety Information */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>4. Safety Information</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Do they live alone?</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="livesAlone"
                      value="yes"
                      checked={formData.livesAlone === 'yes'}
                      onChange={(e) => setFormData({...formData, livesAlone: e.target.value})}
                    />
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="livesAlone"
                      value="no"
                      checked={formData.livesAlone === 'no'}
                      onChange={(e) => setFormData({...formData, livesAlone: e.target.value})}
                    />
                    No
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Is someone available with them during the day?</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="someoneAvailable"
                      value="yes"
                      checked={formData.someoneAvailable === 'yes'}
                      onChange={(e) => setFormData({...formData, someoneAvailable: e.target.value})}
                    />
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="someoneAvailable"
                      value="no"
                      checked={formData.someoneAvailable === 'no'}
                      onChange={(e) => setFormData({...formData, someoneAvailable: e.target.value})}
                    />
                    No
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Have they experienced a fall recently?</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="recentFall"
                      value="yes"
                      checked={formData.recentFall === 'yes'}
                      onChange={(e) => setFormData({...formData, recentFall: e.target.value})}
                    />
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="recentFall"
                      value="no"
                      checked={formData.recentFall === 'no'}
                      onChange={(e) => setFormData({...formData, recentFall: e.target.value})}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* 5. Emergency Contact */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>5. Emergency Contact</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Emergency Contact Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Relationship *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.emergencyRelationship}
                  onChange={(e) => setFormData({...formData, emergencyRelationship: e.target.value})}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* 6. Care Requirements */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>6. Care Requirements</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Type of care required:</label>
                <div style={styles.checkboxGroup}>
                  {['Medical Assistance', 'Daily Care', 'Companionship', 'Emergency Monitoring'].map(care => (
                    <label key={care} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.careType.includes(care)}
                        onChange={() => handleCheckbox('careType', care)}
                      />
                      {care}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>Submit</button>
              <button 
                type="button" 
                onClick={() => navigate('/family/my-parents')} 
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  formWrapper: {
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #e0e0e0',
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  radioGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px',
  },
  submitBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AddParent;
