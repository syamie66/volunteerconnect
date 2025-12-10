import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './Register.css'; // <-- Import CSS here

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // States for all form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('volunteer'); // volunteer or NGO
  const [phone, setPhone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
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
        name,
        email,
        userType,
        phone,
        icNumber,
        address,
        emergencyContact,
        createdAt: new Date()
      });

      setMessage('Registration successful!');
      navigate('/'); // redirect to home or dashboard
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
      <h2>Register</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="IC Number"
          value={icNumber}
          onChange={(e) => setIcNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Emergency Contact"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          required
        />
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="volunteer">Volunteer</option>
          <option value="NGO">NGO</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </section>
  );
}

