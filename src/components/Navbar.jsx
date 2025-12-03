import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="top-nav">
      <div className="logo">VolunteerConnect</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>

        {!currentUser && <Link to="/login">Login</Link>}

        {currentUser && (
          <>
            {profile?.role === 'ngo' && <Link to="/dashboard/ngo">NGO</Link>}
            {profile?.role === 'volunteer' && <Link to="/dashboard">Dashboard</Link>}
            <button className="link-like" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

