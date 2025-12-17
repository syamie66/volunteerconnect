import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import './Login.css';

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

      // Fetch user role from Firestore to redirect appropriately
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const profile = docSnap.exists() ? docSnap.data() : null;

      if (profile?.role === 'ngo') {
        navigate('/dashboard/ngo');
      } else if (profile?.role === 'volunteer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Main Split-Screen Wrapper */}
      <div className="split-wrapper">
        
        {/* LEFT SIDE: Image Section (Matches the layout of the reference image) */}
        <div className="photo-side">
          <div className="image-placeholder">
            {/* Dark gradient overlay can be added via CSS to make text pop */}
            <div className="photo-caption">
              Find a place <br /> 
              you'll <span>love</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Scrapbook Form Section */}
        <div className="form-side">
          <div className="login-box">
            <h2>Login</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="register-text">
              Don't have an account? <Link to="/register">Register now</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
