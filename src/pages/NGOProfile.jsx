import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path if your firebase.js is elsewhere
import './NGOProfile.css';

const NGOProfile = () => {
  const { id } = useParams(); // 1. Get the ID from the URL (e.g., /ngo/123)
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from Firestore when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", id); // Assuming NGOs are stored in 'users' collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching NGO profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  // 3. Loading State
  if (loading) {
    return (
      <div className="profile-page-container" style={{justifyContent:'center'}}>
        <p>Loading Profile...</p>
      </div>
    );
  }

  // 4. Error State (if ID is wrong)
  if (!profile) {
    return (
      <div className="profile-page-container" style={{justifyContent:'center'}}>
        <h2>NGO Not Found</h2>
        <p>The organization you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="profile-header">
        <h4 className="tiny-label">NGO PROFILE</h4>
        <h1 className="main-title">{profile.orgName}</h1>
        <p className="profile-description">
          {profile.description}
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

          {/* Stat 2: Verification (Static for now, or fetch if you have a field) */}
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
                 {/* Opens user's default email client */}
                 <a href={`mailto:${profile.email}`} style={{color: 'white', textDecoration: 'none'}}>
                   Email Us
                 </a>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM WHITE CARD (Vision & Mission Layout) */}
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