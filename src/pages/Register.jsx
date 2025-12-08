import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('volunteer'); // volunteer or NGO
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Call register from AuthContext
      const user = await register(email, password, userType);

      // Optionally, store name in the same Firestore doc
      // If you want to add 'name' field:
      // import { doc, setDoc } from 'firebase/firestore';
      // await setDoc(doc(db, 'users', user.uid), { name }, { merge: true });

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
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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

