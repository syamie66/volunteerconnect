import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const getUserType = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserType(data.userType); 
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
        }
      } else {
        setUserType(null);
      }
    };

    getUserType();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    setUserType(null);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!userType) return '/'; 
    const role = userType.toLowerCase();

    switch (role) {
      case 'admin':
        return '/admin'; // Simplified based on your route structure
      case 'ngo': 
        return '/dashboard/ngo';
      case 'volunteer':
        return '/dashboard';
      default:
        return '/dashboard'; 
    }
  };

  return (
    <nav className="home-navbar-wrapper">
      <div className="rounded-nav">
        <div className="nav-logo-group">
          <span className="logo-badge">NGO</span>
          <span className="logo-text">VolunteerConnect</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          
          {currentUser ? (
            <>
              {/* 1. DASHBOARD LINK */}
              {userType && (
                <Link to={getDashboardPath()}>Dashboard</Link>
              )}

              {/* 2. NEW: MY PROFILE LINK (Only for NGOs) */}
              {userType === 'NGO' && (
                 <Link to={`/ngo/${currentUser.uid}`}>My Profile</Link>
              )}

              <button onClick={handleLogout} className="pill-cta logout">LOGOUT</button>
            </>
          ) : (
            <Link to="/login" className="pill-cta">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
}