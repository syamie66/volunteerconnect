import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../Register.css'; 

const NGORegister = () => {
  const navigate = useNavigate();
  const { registerNGO } = useAuth(); 
  const [error, setError] = useState(''); 
  
  const [formData, setFormData] = useState({
    orgName: '',
    yearFounded: '',
    email: '',
    password: '',
    missionStatement: '',
    beneficiaries: [], 
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedBeneficiaries = [...formData.beneficiaries];

    if (checked) {
      updatedBeneficiaries.push(value);
    } else {
      updatedBeneficiaries = updatedBeneficiaries.filter((item) => item !== value);
    }

    setFormData({ ...formData, beneficiaries: updatedBeneficiaries });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      // Separate email/password from the rest of the data
      const { email, password, ...ngoDetails } = formData;

      // Pass the data to Context. Context handles adding userType: 'NGO'
      await registerNGO(email, password, ngoDetails);

      console.log("NGO Registered Successfully");
      navigate('/dashboard'); 

    } catch (err) {
      console.error("Registration failed:", err);
      setError('Failed to register. ' + err.message);
    }
  };

  const targetGroups = [
    "Children & Youth",
    "Environment & Wildlife",
    "Refugees & Displaced People",
    "Elderly Care",
    "Women's Rights",
    "Disabled Communities",
    "General Public / Community",
    "Other"
  ];

  return (
    <div className="iso-register-container">
      <div className="wide-card">
        
        {/* LEFT SIDE: THE FORM */}
        <div className="wide-form-content">
          
          <div className="form-header">
            <div className="washi-tape"></div>
            <h2>NGO Application</h2>
            <p style={{ marginTop: '10px', color: '#2d332d', fontWeight: '500' }}>
              Tell us about your organization to join our network.
            </p>
            {error && <div style={{color: 'red', marginTop: '10px', fontSize: '0.9rem'}}>{error}</div>}
          </div>

          <form className="triple-grid-form" onSubmit={handleSubmit}>
            
            {/* ROW 1: Name & Year */}
            <div className="input-group span-two">
              <label>Official Organization Name</label>
              <input 
                type="text" 
                name="orgName" 
                placeholder="e.g. Green Earth Foundation" 
                required
                onChange={handleInputChange} 
              />
            </div>

            <div className="input-group">
              <label>Year Founded</label>
              <input 
                type="number" 
                name="yearFounded" 
                placeholder="YYYY" 
                required
                onChange={handleInputChange} 
              />
            </div>

            {/* ROW 2: Email & Password */}
            <div className="input-group span-two">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="organization@gmail.com" 
                required
                onChange={handleInputChange} 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                required
                onChange={handleInputChange} 
              />
            </div>

            {/* ROW 3: Mission */}
            <div className="input-group span-three">
              <label>Mission Statement</label>
              <input 
                type="text" 
                name="missionStatement" 
                placeholder="Briefly state your main goal..." 
                required
                onChange={handleInputChange} 
              />
            </div>

            {/* ROW 4: Checkboxes */}
            <div className="input-group span-three">
              <label style={{marginBottom: '10px'}}>Who do you protect? (Select all that apply)</label>
              
              <div className="checkbox-grid">
                {targetGroups.map((group) => (
                  <label key={group} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      value={group} 
                      onChange={handleCheckboxChange}
                      checked={formData.beneficiaries.includes(group)}
                    />
                    {group}
                  </label>
                ))}
              </div>
            </div>

            {/* ROW 5: Description */}
            <div className="input-group span-three">
              <label>Description about the organization</label>
              <textarea 
                name="description" 
                rows="5"
                placeholder="Tell us more about your work, history, and impact..." 
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #2d332d',
                  fontFamily: "'Inter', sans-serif",
                  width: '100%',
                  resize: 'none' 
                }}
                required
                onChange={handleInputChange} 
              ></textarea>
            </div>

            {/* FOOTER */}
            <div className="form-footer">
              <button type="submit" className="register-btn">
                Register Now
              </button>
              
              <p>
                Already registered? <Link to="/login">Log In here</Link>
              </p>
            </div>

          </form>
        </div>

        {/* RIGHT SIDE: PHOTO AREA */}
        <div className="wide-photo-side">
          <div className="image-placeholder">
            <span className="photo-caption">
              Make a<br />
              Real<br />
              Impact.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NGORegister;