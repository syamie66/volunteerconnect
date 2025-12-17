import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// The CSS is now part of the unified HomeLayout.css or a standalone Navbar.css

export default function Navbar() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="home-navbar-wrapper">
      <nav className="rounded-nav">
        {/* Left Side: Logo */}
        <div className="nav-logo-group">
          <div className="logo-badge">LOCAL</div>
          <span className="logo-text">VolunteerConnect</span>
        </div>

        {/* Center: Navigation Links */}
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/events">EVENTS</Link>
          
          {currentUser && (
            <>
              {profile?.userType === 'admin' && <Link to="/admin">ADMIN</Link>}
              {profile?.userType === 'NGO' && (
                <>
                  <Link to="/create-event">CREATE</Link>
                  <Link to="/dashboard/ngo">NGO DASHBOARD</Link>
                </>
              )}
              {profile?.userType === 'volunteer' && (
                <Link to="/dashboard">DASHBOARD</Link>
              )}
            </>
          )}
        </div>

        {/* Right Side: Auth Action */}
        <div className="nav-actions">
          {!currentUser ? (
            <Link to="/login" className="work-with-us-btn">LOGIN / SIGNUP</Link>
          ) : (
            <button className="work-with-us-btn logout-btn" onClick={handleLogout}>
              LOGOUT
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}


