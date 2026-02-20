import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '\uD83C\uDFE0', label: 'Home' },
    { path: '/categories', icon: '\uD83D\uDCDA', label: 'Categories' },
    { path: '/projects', icon: '\uD83D\uDEE0\uFE0F', label: 'Projects' },
    { path: '/cheatsheets', icon: '\uD83D\uDCC4', label: 'Cheatsheets' },
    { path: '/profile', icon: '\uD83D\uDC64', label: 'Profile' }
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
