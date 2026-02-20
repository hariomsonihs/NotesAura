import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name || currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
          } else {
            setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar gradient-primary">
      <div className="navbar-container">
        <div className="navbar-left">
          <button 
            className="menu-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
          <img src="/logo.webp" alt="NotesAura" className="navbar-logo-img" onClick={() => navigate('/')} />
          <h1 className="navbar-title" onClick={() => navigate('/')}>NotesAura</h1>
        </div>
        
        <div className="navbar-right">
          <button 
            className="icon-btn" 
            onClick={() => navigate('/search')}
            aria-label="Search"
            title="Search"
          >
            🔍
          </button>
          <button 
            className="icon-btn" 
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            title="Notifications"
          >
            🔔
          </button>
          {user ? (
            <div className="user-menu">
              <button 
                className="icon-btn" 
                onClick={() => navigate('/profile')}
                aria-label="Profile"
                title="Profile"
              >
                👤
              </button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Drawer Menu */}
      <div className={`drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)}></div>
        <div className="drawer-content">
          <div className="drawer-header gradient-primary">
            <div className="drawer-user-info">
              <h3>{userName}</h3>
              <p>{user?.email || 'Please login'}</p>
            </div>
          </div>
          <div className="drawer-menu">
            <button onClick={() => { navigate('/'); setMenuOpen(false); }}>
              🏠 Home
            </button>
            <button onClick={() => { navigate('/categories'); setMenuOpen(false); }}>
              📚 Categories
            </button>
            <button onClick={() => { navigate('/courses'); setMenuOpen(false); }}>
              💻 All Courses
            </button>
            <button onClick={() => { navigate('/quiz'); setMenuOpen(false); }}>
              🎯 Quizzes
            </button>
            <button onClick={() => { navigate('/interview'); setMenuOpen(false); }}>
              💼 Interviews
            </button>
            <button onClick={() => { navigate('/ebooks'); setMenuOpen(false); }}>
              📖 Ebooks
            </button>
            <button onClick={() => { navigate('/about'); setMenuOpen(false); }}>
              ℹ️ About
            </button>
            <button onClick={() => { window.open('https://wa.me/917667110195', '_blank'); }}>
              📞 Contact
            </button>
            {user && (
              <button onClick={handleLogout} style={{color: '#ef4444'}}>
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
