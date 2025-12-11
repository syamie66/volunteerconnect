import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './Register.css'; 

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // States for all form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('volunteer');
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

    try {
      // Register the user
      const user = await register(email, password, userType);

      // Save all additional info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name, email, userType, phone, icNumber, address,
        emergencyContact, gender, skills,
        createdAt: new Date()
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
    <section className="section">
      <h2>Join Our Team</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        
        {/* ==================================== */}
        {/* SECTION 1: Account & Identity */}
        {/* ==================================== */}
        <div className="form-section-header">
            <h3>1. Account & Identity</h3>
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
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="volunteer">Registering as Volunteer</option>
                <option value="NGO">Registering as NGO</option>
            </select>
        </div>

        {/* ==================================== */}
        {/* SECTION 2: Contact & Access */}
        {/* ==================================== */}
        <div className="form-section-header">
            <h3>2. Contact & Access</h3>
        </div>

        <div className="form-grid">
            <input
                type="email"
                placeholder="Email Address *"
                className="highlight-field" // <-- HIGHLIGHTED FIELD
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password (min 6 characters) *"
                className="highlight-field" // <-- HIGHLIGHTED FIELD
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
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

        {/* ==================================== */}
        {/* SECTION 3: Address & Capacity */}
        {/* ==================================== */}
        <div className="form-section-header">
            <h3>3. Location & Skills</h3>
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
            <textarea
                className="full-width"
                placeholder="Skills & Expertise (e.g., First Aid, Multilingual, IT support) (Optional)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows="3"
            ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </section>
  );
}