import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getEarnings } from '../../services/api';

const Earnings = () => {
  const [earnings, setEarnings] = useState({ total: 15000, thisMonth: 5000, transactions: [] });

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const { data } = await getEarnings();
      setEarnings(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar title="Earnings" />
      
      <div style={styles.content}>
        <div style={styles.summaryCard}>
          <div style={styles.totalSection}>
            <p style={styles.totalLabel}>Total Earnings</p>
            <h2 style={styles.totalAmount}>₹{earnings.total}</h2>
          </div>
          <div style={styles.monthSection}>
            <p style={styles.monthLabel}>This Month</p>
            <p style={styles.monthAmount}>₹{earnings.thisMonth}</p>
          </div>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Transaction History</h3>
          {earnings.transactions?.map((txn, index) => (
            <div key={index} style={styles.txnCard}>
              <div>
                <p style={styles.txnTitle}>{txn.description}</p>
                <p style={styles.txnDate}>{txn.date}</p>
              </div>
              <p style={styles.txnAmount}>+₹{txn.amount}</p>
            </div>
          ))}
        </section>

        <button style={styles.withdrawBtn}>Withdraw Funds</button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#fafafa' },
  content: { padding: '20px' },
  summaryCard: { backgroundColor: '#333', color: '#ffffff', padding: '30px 20px', borderRadius: '12px', marginBottom: '24px' },
  totalSection: { marginBottom: '20px' },
  totalLabel: { fontSize: '14px', opacity: 0.8, marginBottom: '8px' },
  totalAmount: { fontSize: '36px', fontWeight: '700' },
  monthSection: { display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' },
  monthLabel: { fontSize: '14px', opacity: 0.8 },
  monthAmount: { fontSize: '18px', fontWeight: '600' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' },
  txnCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '12px' },
  txnTitle: { fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' },
  txnDate: { fontSize: '12px', color: '#999' },
  txnAmount: { fontSize: '16px', fontWeight: '600', color: '#4CAF50' },
  withdrawBtn: { width: '100%', padding: '14px', backgroundColor: '#333', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '12px' },
};

export default Earnings;
