// src/pages/ProfileUpdate.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './ProfileUpdate.css'; // Reuse registration CSS for form styling

export default function ProfileUpdate() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // States initialized to empty or null
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [gender, setGender] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Fetch existing user data to populate the form
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
        } else {
          setError("User profile not found in database.");
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
      
      // Use updateDoc to save the changes to Firestore
      await updateDoc(userRef, {
        name, phone, icNumber, address, emergencyContact, gender, skills
      });

      setMessage('Profile updated successfully!');
      // Optional: redirect back to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1500); 

    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (!currentUser) return <p className="loading-text">Please log in to update your profile.</p>;


  return (
    <section className="section">
      <Link to="/dashboard" style={{ color: '#800020', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>
      <h2>Update My Profile</h2>
      {error && <p className="message" style={{ backgroundColor: '#fcebeb', color: '#dc3545' }}>{error}</p>}
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        
        {/* SECTION 1: Identity & Contact */}
        <div className="form-section-header">
            <h3>1. Identity & Contact Details</h3>
        </div>

        <div className="form-grid">
            <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="IC Number *"
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                required
            />
            <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
            </select>
        </div>

        {/* SECTION 2: Address, Emergency & Skills */}
        <div className="form-section-header">
            <h3>2. Address, Emergency & Skills</h3>
        </div>
        
        <div className="form-grid">
            <input
                type="text"
                className="full-width"
                placeholder="Full Mailing Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            <input
                type="tel"
                placeholder="Emergency Contact Phone *"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
            />
            {/* Displaying Email but it's not editable here */}
             <input
                type="email"
                placeholder="Email (Cannot be changed here)"
                value={currentUser.email}
                disabled
            />
            <textarea
                className="full-width"
                placeholder="Skills & Expertise (e.g., First Aid, Multilingual, IT support) (Optional)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows="3"
            ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating Profile...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}