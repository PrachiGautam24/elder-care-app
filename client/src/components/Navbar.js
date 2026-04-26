import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ title }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.title}>{title}</h2>
      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Navbar;
