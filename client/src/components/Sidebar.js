import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ onExpandChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: '⌂', label: 'Home', path: '/family/dashboard' },
    { icon: '👥', label: 'Family', path: '/family/my-parents' },
    { icon: '🔍', label: 'Find Caregivers', path: '/family/search' },
    { icon: '🤖', label: 'AI Assistant', path: '/family/ai-assistant' },
    { icon: '📱', label: 'Live Care', path: '/family/live-care' },
    { icon: '📅', label: 'Bookings', path: '/family/bookings' },
    { icon: '⚙', label: 'Settings', path: '/family/settings' },
  ];

  const handleExpand = (val) => {
    setIsExpanded(val);
    onExpandChange && onExpandChange(val);
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{ ...styles.sidebar, width: isExpanded ? '240px' : '72px' }}
      onMouseEnter={() => handleExpand(true)}
      onMouseLeave={() => handleExpand(false)}
    >
      {/* Logo */}
      <div style={styles.logoSection}>
        <div style={styles.logoIcon}>E</div>
        {isExpanded && <span style={styles.logoText}>ElderEase</span>}
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.menuItem,
              ...(isActive(item.path) ? styles.menuItemActive : {}),
              justifyContent: isExpanded ? 'flex-start' : 'center',
            }}
            title={!isExpanded ? item.label : ''}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            {isExpanded && <span style={styles.menuLabel}>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{ ...styles.logoutBtn, justifyContent: isExpanded ? 'flex-start' : 'center' }}
        title={!isExpanded ? 'Logout' : ''}
      >
        <span style={styles.menuIcon}>↩</span>
        {isExpanded && <span style={styles.menuLabel}>Logout</span>}
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    zIndex: 1000,
    transition: 'width 0.25s ease',
    overflow: 'hidden',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 18px',
    marginBottom: '32px',
    minHeight: '40px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#111111',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111111',
    whiteSpace: 'nowrap',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0 10px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 10px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#666',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  menuItemActive: {
    backgroundColor: '#f0f0f0',
    color: '#111111',
    fontWeight: '600',
  },
  menuIcon: {
    fontSize: '18px',
    flexShrink: 0,
    width: '24px',
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: '14px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0 10px',
    padding: '10px 10px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default Sidebar;
