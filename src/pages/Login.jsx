import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import Context
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Login.css'; 

export default function Login() {
  // Use the login function from AuthContext
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State for handling errors
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    try {
      // 1. Call login from Context 
      // (This triggers the check for deleted users inside AuthContext)
      const user = await login(email, password);

      // 2. Fetch the profile to check the ROLE
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const profile = docSnap.exists() ? docSnap.data() : null;

      // --- DEBUGGING LOGS ---
      console.log("Login Successful. User ID:", user.uid);
      console.log("Firestore Profile Data:", profile);
      // ----------------------

      // 3. Handle Navigation based on User Type
      // Checking both 'userType' and 'role' to be safe
      const userType = profile?.userType || profile?.role;

      if (userType === 'NGO' || userType === 'ngo') {
        console.log("Redirecting to NGO Dashboard...");
        navigate('/dashboard/ngo');
      } else if (userType === 'Volunteer' || userType === 'volunteer') {
        console.log("Redirecting to Volunteer Dashboard...");
        navigate('/dashboard');
      } else if (userType === 'admin') {
        navigate('/admin/users');
      } else {
        console.log("Unknown role, redirecting home...");
        navigate('/');
      }

    } catch (err) {
      console.error("Login Error:", err);
      
      // 4. Custom Error Handling
      if (err.message && (err.message.includes("permanently deleted") || err.message.includes("Access Denied"))) {
         setError("Access Denied: This account has been deleted by an administrator.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError("Invalid email or password.");
      } else {
         setError("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iso-login-container">
      <div className="split-wrapper">
        
        {/* LEFT SIDE: Image Section */}
        <div className="photo-side">
          <div className="image-placeholder">
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
            
            {/* Error Message Display */}
            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '10px', 
                borderRadius: '6px', 
                marginBottom: '15px',
                fontSize: '0.9rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

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
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Eye Off Icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      // Eye Icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
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