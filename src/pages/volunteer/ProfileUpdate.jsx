import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './ProfileUpdate.css'; 

export default function ProfileUpdate() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [skills, setSkills] = useState('');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setGender(data.gender || '');
          setAge(data.age || '');
          setPhone(data.phone || '');
          setIcNumber(data.icNumber || '');
          setEmergencyContact(data.emergencyContact || '');
          setAddress(data.address || '');
          setSkills(data.skills || '');
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchUserData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name, gender, age: parseInt(age), phone,
        icNumber, emergencyContact, address, skills
      });
      setTimeout(() => navigate('/dashboard'), 1000); 
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  if (loading && !name) return <div className="pu-wrapper">LOADING...</div>;

  return (
    <div className="pu-wrapper">
      <div className="pu-container">
        
        {/* --- LEFT: SUMMARY CARD --- */ }
        <aside className="pu-summary-card">
            
            <div className="pu-avatar-container">
                <div className="pu-avatar-circle">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
                {/* Text instead of pencil emoji */}
                <div className="pu-edit-badge">EDIT</div>
            </div>

            <h3 className="pu-user-name">{name.toUpperCase() || "USER"}</h3>
            <p className="pu-user-role">VOLUNTEER</p>
            
            <div className="pu-divider"></div>

            <div className="pu-info-list">
                <div className="pu-info-row">
                    <span className="pu-info-label">EMAIL</span>
                    <span className="pu-info-value" title={currentUser?.email}>{currentUser?.email?.toUpperCase()}</span>
                </div>
                <div className="pu-info-row">
                    <span className="pu-info-label">PHONE</span>
                    <span className="pu-info-value">{phone || "--"}</span>
                </div>
                <div className="pu-info-row">
                    <span className="pu-info-label">LOCATION</span>
                    <span className="pu-info-value">{address ? "MALAYSIA" : "--"}</span>
                </div>
                 <div className="pu-info-row">
                    <span className="pu-info-label">IC NO.</span>
                    <span className="pu-info-value">{icNumber || "--"}</span>
                </div>
            </div>

            <div className="pu-status-row">
                <span className="pu-status-label">PROFILE STATUS</span>
                <span className="pu-status-dot"></span>
            </div>

            {/* Text instead of arrow emoji */}
            <Link to="/dashboard" className="pu-back-dashboard">
                <span>BACK TO DASHBOARD</span>
            </Link>

        </aside>

        {/* --- RIGHT: FORM CARD --- */}
        <main className="pu-form-card">
            <div className="pu-section-header">
                <h2>EDIT PERSONAL DETAILS</h2>
            </div>

            <form onSubmit={handleSubmit} className="pu-form-grid">
                
                <div className="pu-span-2">
                    <label className="pu-label">FULL NAME</label>
                    <input className="pu-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="pu-span-2">
                    <label className="pu-label">EMAIL ADDRESS (READ-ONLY)</label>
                    <input className="pu-input pu-input-disabled" type="email" value={currentUser?.email} disabled />
                </div>

                <div>
                    <label className="pu-label">GENDER</label>
                    <select className="pu-input" value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="Male">MALE</option>
                        <option value="Female">FEMALE</option>
                    </select>
                </div>
                <div>
                    <label className="pu-label">AGE</label>
                    <input className="pu-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>

                <div>
                    <label className="pu-label">PHONE</label>
                    <input className="pu-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                    <label className="pu-label">IC NUMBER</label>
                    <input className="pu-input" type="text" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} required />
                </div>

                <div className="pu-span-2">
                    <label className="pu-label">MAILING ADDRESS</label>
                    <input className="pu-input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                
                <div className="pu-span-2">
                    <label className="pu-label">EMERGENCY SOS</label>
                    <input className="pu-input" type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required />
                </div>

                 <div className="pu-span-2">
                    <label className="pu-label">SKILLS</label>
                    <input className="pu-input" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>

                <div className="pu-actions">
                    <Link to="/dashboard" className="pu-btn-cancel">DISCARD CHANGES</Link>
                    <button type="submit" className="pu-btn-save">SAVE CHANGES</button>
                </div>

            </form>
        </main>

      </div>
    </div>
  );
}