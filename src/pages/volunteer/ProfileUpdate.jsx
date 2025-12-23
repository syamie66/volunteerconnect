import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './ProfileUpdate.css'; 

export default function ProfileUpdate() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [gender, setGender] = useState('');
  const [skills, setSkills] = useState('');
  const [age, setAge] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setIcNumber(data.icNumber || '');
          setAddress(data.address || '');
          setEmergencyContact(data.emergencyContact || '');
          setGender(data.gender || '');
          setSkills(data.skills || '');
          setAge(data.age || '');
        } else {
          setError("User profile not found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name, phone, icNumber, address, emergencyContact, gender, skills, age
      });

      setMessage('Profile updated successfully!');
      
      // REDIRECT TO DASHBOARD AFTER SAVE
      setTimeout(() => navigate('/dashboard'), 1500); 

    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !name) return <div className="profile-update-wrapper"><p className="status-msg">Loading...</p></div>;
  if (!currentUser) return <div className="profile-update-wrapper"><p className="status-msg">Please log in.</p></div>;

  return (
    <div className="profile-update-wrapper">
      {/* Background Pattern */}
      <div className="update-bg-pattern"></div>

      <div className="update-container">
        
        <div className="update-header">
           {/* BACK BUTTON REDIRECTING TO DASHBOARD */}
           <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
           <h1>Update Profile</h1>
        </div>

        {error && <div className="status-msg error">{error}</div>}
        {message && <div className="status-msg success">{message}</div>}

        <div className="update-layout">
          
          {/* LEFT SIDE: FORM */}
          <div className="update-form-side">
            <form onSubmit={handleSubmit}>
              
              {/* Identity Section */}
              <div className="form-section">
                <h3 className="section-title">01. Identity Details</h3>
                
                <div className="input-row">
                  <div className="input-pill-wrapper">
                    <label>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-pill-wrapper">
                    <label>IC Number</label>
                    <input type="text" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} required />
                  </div>
                  <div className="input-pill-wrapper">
                    <label>Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-pill-wrapper">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="input-pill-wrapper">
                    <label>Email (Read-only)</label>
                    <input type="email" value={currentUser.email} disabled className="disabled-input" />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="form-section">
                <h3 className="section-title">02. Contact & Address</h3>
                
                <div className="input-row">
                  <div className="input-pill-wrapper">
                     <label>Phone Number</label>
                     <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="input-pill-wrapper">
                     <label>Emergency Contact</label>
                     <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-pill-wrapper">
                     <label>Mailing Address</label>
                     <textarea 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        placeholder="Street, City, State..."
                     />
                  </div>
                </div>

                <div className="input-row">
                   <div className="input-pill-wrapper">
                      <label>Skills / Bio</label>
                      <textarea 
                        value={skills} 
                        onChange={(e) => setSkills(e.target.value)} 
                        placeholder="e.g. Photography, First Aid..."
                      />
                   </div>
                </div>
              </div>

              <button type="submit" className="save-pill-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

            </form>
          </div>

          {/* RIGHT SIDE: LIVE PREVIEW */}
          <aside className="update-summary-side">
             <div className="summary-card">
                <span className="summary-org">Profile Preview</span>
                <h2 className="summary-title">{name || "Your Name"}</h2>
                <p className="summary-desc">
                  {skills || "Your skills and bio will appear here."}
                </p>
                
                <div className="summary-details">
                   <div className="detail-item">
                      <span>Email</span>
                      <span className="sage-text">{currentUser.email}</span>
                   </div>
                   <div className="detail-item">
                      <span>Phone</span>
                      <span className="sage-text">{phone || "N/A"}</span>
                   </div>
                   <div className="detail-item">
                      <span>Location</span>
                      <span className="sage-text">{address ? "Updated" : "N/A"}</span>
                   </div>
                </div>

                <div className="detail-total">
                   <span>Profile Status</span>
                   <span className="sage-text">Active</span>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}