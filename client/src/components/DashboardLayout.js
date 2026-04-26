import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);

  return (
    <div style={styles.container}>
      <Sidebar onExpandChange={setIsSidebarExpanded} />
      <div style={{ ...styles.main, marginLeft: isSidebarExpanded ? '240px' : '72px' }}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <p style={styles.greeting}>
              Good {getGreeting()}, <span style={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</span>
            </p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.25s ease',
    minWidth: 0,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e8e8e8',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {},
  greeting: {
    fontSize: '15px',
    color: '#555',
  },
  userName: {
    fontWeight: '600',
    color: '#111',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#111111',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: '28px 32px',
  },
};

export default DashboardLayout;
