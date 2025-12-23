import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import './NGOProfile.css';

const NGOProfile = () => {
  const { id } = useParams(); // Catches ID from URL (e.g. /ngo/123)
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Priority: 1. State (rare now), 2. URL Param (Guests), 3. Current User (Owner)
      const passedId = location.state?.targetNgoId;
      const targetId = passedId || id || currentUser?.uid;

      if (!targetId) {
        setLoading(false);
        return;
      }

      try {
        let foundData = null;
        const usersRef = collection(db, "users"); 

        // CHECK 1: Direct Document ID
        const docRef = doc(db, "users", targetId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          foundData = docSnap.data();
        } 
        
        // CHECK 2: Field 'uid'
        if (!foundData) {
          const q = query(usersRef, where("uid", "==", targetId));
          const snap = await getDocs(q);
          if (!snap.empty) foundData = snap.docs[0].data();
        }

        // CHECK 3: Field 'userId'
        if (!foundData) {
          const q = query(usersRef, where("userId", "==", targetId));
          const snap = await getDocs(q);
          if (!snap.empty) foundData = snap.docs[0].data();
        }

        // CHECK 4: Field 'id'
        if (!foundData) {
          const q = query(usersRef, where("id", "==", targetId));
          const snap = await getDocs(q);
          if (!snap.empty) foundData = snap.docs[0].data();
        }

        if (foundData) {
          setProfile(foundData);
        } else {
          console.error("Profile not found for ID:", targetId);
        }

      } catch (error) {
        console.error("Error fetching NGO profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser, location.state]);

  // Logic to check if the current user owns this profile
  // If currentUser is null (guest), isOwner becomes false automatically.
  const isOwner = currentUser && profile && (
    currentUser.uid === profile.uid || 
    currentUser.uid === profile.userId || 
    currentUser.uid === profile.id
  );

  if (loading) return (
    <div className="profile-page-container" style={{justifyContent:'center'}}>
      <p>Loading Profile...</p>
    </div>
  );

  if (!profile) return (
    <div className="profile-page-container" style={{justifyContent:'center'}}>
      <h2>Profile Not Found</h2>
    </div>
  );

  return (
    <div className="profile-page-container">
      
      {/* 1. TOP HEADER */}
      <div className="profile-header">
        <h4 className="tiny-label">NGO PROFILE</h4>
        <h1 className="main-title">{profile.organizationName || profile.orgName || "Organization Name"}</h1>
        <p className="profile-description">
          {profile.description || "No description provided."}
        </p>
      </div>

      {/* 2. STATS PILL */}
      <div className="stats-pill-container">
        <div className="stats-pill">
          
          <div className="stat-item">
            <div className="icon-circle">📅</div>
            <div className="stat-text">
              <span className="stat-label">Est. Year</span>
              <span className="stat-value">{profile.yearFounded || "N/A"}</span>
            </div>
          </div>

          <div className="divider-line"></div>

          <div className="stat-item">
            <div className="icon-circle">🛡️</div>
            <div className="stat-text">
              <span className="stat-label">Status</span>
              <span className="stat-value">Verified NGO</span>
            </div>
          </div>

          <div className="divider-line"></div>

          <div className="stat-item">
            <div className="icon-circle">✉️</div>
            <div className="stat-text">
              <span className="stat-label">Contact</span>
              <span className="stat-value">
                 <a 
                   href={`mailto:${profile.email}`} 
                   style={{
                     color: 'white', 
                     textDecoration: 'underline', 
                     fontSize: '0.9rem',     
                     wordBreak: 'break-all'  
                   }}
                 >
                   {profile.email || "No Email"}
                 </a>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. DETAILS CARD */}
      <div className="content-card">
        <div className="split-layout">
          
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

          <div className="split-column">
            <div className="column-header">
              <span className="header-icon">🌱</span>
              <h3>Who We Support</h3>
            </div>
            <p className="column-text">We are committed to making a difference for these key groups:</p>
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

        {/* 4. ACTION AREA */}
        <div className="action-area">
          <button className="contact-btn" onClick={() => window.location.href = `mailto:${profile.email}`}>
            Contact Organization
          </button>

          {/* Only show Edit button if isOwner is true (Not for Guests) */}
          {isOwner && (
            <button 
              className="edit-btn" 
              onClick={() => navigate('/edit-ngo-profile')}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOProfile;