import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; 
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; 
import { db } from '../firebase';
import './NGOProfile.css';

const NGOProfile = () => {
  const { id } = useParams(); 
  const location = useLocation(); // Hook to receive data from EventCard
  const { currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. PRIORITY: Check if ID was passed from EventCard
      const passedId = location.state?.targetNgoId;
      
      // 2. Determine which ID to use
      const targetId = passedId || id || currentUser?.uid;

      console.log("Fetching Profile for ID:", targetId);

      if (!targetId) {
        console.warn("No Target ID found. User might not be logged in or no ID passed.");
        setLoading(false);
        return;
      }

      try {
        // IMPORTANT: Ensure your NGOs are in the "users" collection. 
        // If they are in a collection named "ngos", change "users" to "ngos" below.
        const docRef = doc(db, "users", targetId); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No profile document found!");
        }
      } catch (error) {
        console.error("Error fetching NGO profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser, location.state]); 

  // --- Loading State ---
  if (loading) {
    return (
      <div className="profile-page-container" style={{justifyContent:'center'}}>
        <p>Loading Profile...</p>
      </div>
    );
  }

  // --- Error State ---
  if (!profile) {
    return (
      <div className="profile-page-container" style={{justifyContent:'center'}}>
        <h2>Profile Not Found</h2>
        <p>We couldn't find the organization details.</p>
        <p style={{fontSize: '0.8rem', color: '#666'}}>Debug ID: {location.state?.targetNgoId || currentUser?.uid || "None"}</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="profile-header">
        <h4 className="tiny-label">NGO PROFILE</h4>
        <h1 className="main-title">{profile.organizationName || profile.orgName || "Organization Name"}</h1>
        <p className="profile-description">
          {profile.description || "No description provided."}
        </p>
      </div>

      {/* 2. OVERLAPPING GREEN STATS BAR */}
      <div className="stats-pill-container">
        <div className="stats-pill">
          
          {/* Stat 1: Year Founded */}
          <div className="stat-item">
            <div className="icon-circle">
              <span role="img" aria-label="calendar">📅</span>
            </div>
            <div className="stat-text">
              <span className="stat-label">Est. Year</span>
              <span className="stat-value">{profile.yearFounded || "N/A"}</span>
            </div>
          </div>

          <div className="divider-line"></div>

          {/* Stat 2: Verification */}
          <div className="stat-item">
            <div className="icon-circle">
              <span role="img" aria-label="shield">🛡️</span>
            </div>
            <div className="stat-text">
              <span className="stat-label">Status</span>
              <span className="stat-value">Verified NGO</span>
            </div>
          </div>

          <div className="divider-line"></div>

          {/* Stat 3: Contact */}
          <div className="stat-item">
            <div className="icon-circle">
              <span role="img" aria-label="mail">✉️</span>
            </div>
            <div className="stat-text">
              <span className="stat-label">Contact</span>
              <span className="stat-value">
                 <a href={`mailto:${profile.email}`} style={{color: 'white', textDecoration: 'none'}}>
                   Email Us
                 </a>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM WHITE CARD */}
      <div className="content-card">
        <div className="split-layout">
          
          {/* LEFT: MISSION */}
          <div className="split-column">
            <div className="column-header">
              <span className="header-icon">🎯</span>
              <h3>Our Mission</h3>
            </div>
            <p className="column-text">
              {profile.missionStatement || "No mission statement provided."}
            </p>
          </div>

          <div className="vertical-divider"></div>

          {/* RIGHT: BENEFICIARIES */}
          <div className="split-column">
            <div className="column-header">
              <span className="header-icon">🌱</span>
              <h3>Who We Support</h3>
            </div>
            <p className="column-text">
              We are committed to making a difference for these key groups:
            </p>
            <div className="tags-container">
              {profile.beneficiaries && profile.beneficiaries.length > 0 ? (
                profile.beneficiaries.map((item, index) => (
                  <span key={index} className="pink-tag">{item}</span>
                ))
              ) : (
                <span className="pink-tag">General Public</span>
              )}
            </div>
          </div>

        </div>

        {/* BUTTON */}
        <div className="action-area">
          <button className="contact-btn" onClick={() => window.location.href = `mailto:${profile.email}`}>
            Contact Organization
          </button>
        </div>
      </div>
    </div>
  );
};

export default NGOProfile;