import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [phone, setPhone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [gender, setGender] = useState('');
  const [skills, setSkills] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!userType) {
      setMessage('Please select a role (Volunteer or NGO).');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Firebase Auth user
      const user = await register(email, password);

      // 2. Save full profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        userType,          // volunteer or NGO
        phone,
        icNumber,
        address,
        emergencyContact,
        gender,
        skills,
        createdAt: serverTimestamp(),
      });

      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setMessage('This email is already registered.');
      } else if (err.code === 'auth/invalid-email') {
        setMessage('Invalid email format.');
      } else if (err.code === 'auth/weak-password') {
        setMessage('Password should be at least 6 characters.');
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <section id="registerForm" className="section fade-up">
        <h2>Create Your Account</h2>
        {message && <p className="message">{message}</p>}

        {/* ===================== ROLE SELECTION ===================== */}
        <div className="form-section-header">
          <h3>Choose Your Role</h3>
        </div>
        <div className="form-grid">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="full-width"
            required
          >
            <option value="" disabled>Select Your Role *</option>
            <option value="volunteer">Volunteer</option>
            <option value="NGO">NGO / Organization</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="form">

          {/* 1. Account & Identity */}
          <div className="form-section-header">
            <h3>Account & Identity</h3>
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
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="" disabled>Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Prefer not to say</option>
            </select>
          </div>

          {/* 2. Contact & Access */}
          <div className="form-section-header">
            <h3>Contact & Access</h3>
          </div>
          <div className="form-grid">
            <input
              type="tel"
              placeholder="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Emergency Contact Phone *"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              required
            />
          </div>

          {/* 3. Location & Skills */}
          <div className="form-section-header">
            <h3>Location & Skills</h3>
          </div>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Full Mailing Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="full-width"
            />
            <textarea
              placeholder="Skills & Expertise (Optional)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows="3"
              className="full-width"
            ></textarea>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </section>
    </div>
  );
}

