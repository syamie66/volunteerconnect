import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [age, setAge] = useState('');
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
    try {
      const user = await register(email, password);
      await setDoc(doc(db, 'users', user.uid), {
        name, email, age: parseInt(age), userType, phone,
        icNumber, address, emergencyContact, gender, skills,
        createdAt: serverTimestamp(),
      });
      setMessage('Registration successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container register-wide-mode">
      <div className="wide-card">
        {/* FORM SIDE (LEFT) */}
        <div className="wide-form-content">
          <div className="form-header">
            <h2>Create Your Account</h2>
            <div className="washi-tape-horizontal"></div>
          </div>

          <form onSubmit={handleSubmit} className="triple-grid-form">
            {/* Row 1 */}
            <div className="input-group">
              <label>Role</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)} required className="custom-select">
                <option value="" disabled>Select Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="NGO">NGO</option>
              </select>
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@link.com" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Row 2 */}
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required className="custom-select">
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Row 3 */}
            <div className="input-group">
              <label>IC Number</label>
              <input type="text" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Emergency Contact</label>
              <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required />
            </div>

            {/* Row 4 - Full Width items */}
            <div className="input-group span-two">
              <label>Mailing Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Skills</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Photography, etc." />
            </div>

            <div className="form-footer">
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Register Now'}
              </button>
              <p>Already a member? <Link to="/login">Login</Link></p>
            </div>
          </form>
        </div>

        {/* PHOTO SIDE (RIGHT) */}
        <div className="wide-photo-side">
          <div className="image-placeholder">
            <div className="photo-caption">Be the <br/><span>change</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

