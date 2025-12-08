// src/pages/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Fetch profile from 'users' collection
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      const profile = docSnap.exists() ? docSnap.data() : null;

      // Redirect based on role
      if (profile?.role === 'ngo') navigate('/dashboard/ngo');
      else if (profile?.role === 'volunteer') navigate('/dashboard');
      else navigate('/');

    } catch (err) {
      if (err.code === 'auth/user-not-found') alert('No user found with this email.');
      else if (err.code === 'auth/wrong-password') alert('Incorrect password.');
      else if (err.code === 'auth/invalid-email') alert('Invalid email format.');
      else alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
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
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '12px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#0077c2', fontWeight: 'bold' }}>
          Register now
        </Link>
      </p>
    </section>
  );
}


