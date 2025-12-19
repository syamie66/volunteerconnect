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

  // --- NEW: Handle Role Selection & Redirect ---
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setUserType(selectedRole);

    // If NGO is selected, redirect immediately
    if (selectedRole === 'NGO') {
      navigate('/ngo-register'); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(email, password);
      // Only saving Volunteer data here since NGOs use the other form
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
    <div className="iso-register-container">
      <div className="wide-card">
        
        {/* LEFT SIDE: FORM CONTENT (Pink Background) */}
        <div className="wide-form-content">
          <div className="form-header">
            <div className="washi-tape"></div> {/* Pink Tape Decoration */}
            <h2>Create Your Account</h2>
          </div>

          {/* TRIPLE GRID LAYOUT: Organizes fields into 3 columns */}
          <form onSubmit={handleSubmit} className="triple-grid-form">
            
            {/* --- MODIFIED INPUT GROUP --- */}
            <div className="input-group">
              <label>Role</label>
              <select value={userType} onChange={handleRoleChange} required>
                <option value="" disabled>Select Role</option>
                <option value="volunteer">Volunteer</option>
                <option value="NGO">NGO</option>
              </select>
            </div>

            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe"/>
            </div>

            <div className="input-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* ROW 2: Contact & Age */}
            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@email.com" required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"/>
            </div>

            <div className="input-group">
              <label>Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="21"/>
            </div>

            {/* ROW 3: Details */}
            <div className="input-group">
              <label>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+60..."/>
            </div>

            <div className="input-group">
              <label>IC Number</label>
              <input type="text" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} required placeholder="XXXXXX-XX-XXXX"/>
            </div>

            <div className="input-group">
              <label>Emergency Contact</label>
              <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required />
            </div>

            {/* ROW 4: Spanning Inputs */}
            <div className="input-group span-two">
              <label>Mailing Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Street Name, City"/>
            </div>

            <div className="input-group">
              <label>Skills / Notes</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Photography, Cooking..." />
            </div>

            {/* FOOTER */}
            <div className="form-footer">
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Register Now'}
              </button>
              
              <p>
                Already a member? <Link to="/login">Login here</Link>
              </p>
            </div>
            
            {message && <p style={{gridColumn: 'span 3', color: 'red', textAlign: 'center', marginTop: '10px'}}>{message}</p>}
          </form>
        </div>

        {/* RIGHT SIDE: PHOTO (Sage Green Background) */}
        <div className="wide-photo-side">
          <div className="image-placeholder">
            <div className="photo-caption">
              Be the <br/>
              change.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}