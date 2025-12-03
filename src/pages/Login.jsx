import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="section">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Call-to-action link for users without an account */}
      <p style={{ textAlign: 'center', marginTop: '12px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#0077c2', fontWeight: 'bold' }}>
          Register now
        </Link>
      </p>
    </section>
  );
}
