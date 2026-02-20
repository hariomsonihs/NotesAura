import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/categories', icon: '📚', label: 'Categories' },
    { path: '/programs', icon: '📱', label: 'Programs' },
    { path: '/ebooks', icon: '📖', label: 'Ebooks' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <div className="bottom-nav-wrapper">
      <div className="bottom-nav card">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
