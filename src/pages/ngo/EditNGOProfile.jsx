import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './EditNGOProfile.css';

export default function EditNGOProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    orgName: '',
    yearFounded: '',
    missionStatement: '',
    description: '',
    beneficiaries: [],
    contactEmail: '',
    location: '',
    website: '',
    photoURL: '' 
  });

  const targetGroups = [
    "Children & Youth", "Environment & Wildlife", "Refugees & Displaced People",
    "Elderly Care", "Women's Rights", "Disabled Communities",
    "General Public / Community", "Other"
  ];

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                setFormData(prev => ({ 
                    ...prev, 
                    ...data, 
                    contactEmail: data.contactEmail || data.email || currentUser.email || '',
                    beneficiaries: data.beneficiaries || [] 
                }));
            } else {
                setFormData(prev => ({ ...prev, contactEmail: currentUser.email }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
      }
    }
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedBeneficiaries = [...formData.beneficiaries];
    if (checked) {
      if (!updatedBeneficiaries.includes(value)) updatedBeneficiaries.push(value);
    } else {
      updatedBeneficiaries = updatedBeneficiaries.filter((item) => item !== value);
    }
    setFormData({ ...formData, beneficiaries: updatedBeneficiaries });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        orgName: formData.orgName,
        yearFounded: formData.yearFounded,
        missionStatement: formData.missionStatement,
        description: formData.description,
        beneficiaries: formData.beneficiaries,
        location: formData.location,
        website: formData.website,
        contactEmail: formData.contactEmail,
        photoURL: formData.photoURL
      });
      alert("Profile updated successfully! 🌱");
      navigate('/ngo-dashboard');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        
        {/* HEADER */}
        <div className="edit-profile-header">
            <div>
                <h2>Edit Profile</h2>
                <p>Keep your mission up to date.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
            
            {/* ROW 1: General Info (4 Columns) */}
            <div className="edit-form-grid">
                <div className="edit-input-group">
                    <label>Org Name</label>
                    <input type="text" name="orgName" value={formData.orgName || ''} onChange={handleChange} required />
                </div>
                <div className="edit-input-group">
                    <label>Year</label>
                    <input type="number" name="yearFounded" value={formData.yearFounded || ''} onChange={handleChange} required />
                </div>
                
                {/* EMAIL INPUT */}
                <div className="edit-input-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="contactEmail" 
                        value={formData.contactEmail || ''} 
                        onChange={handleChange} 
                        placeholder="contact@org.com"
                    />
                </div>

                 <div className="edit-input-group">
                    <label>Website</label>
                    <input type="text" name="website" value={formData.website || ''} onChange={handleChange} placeholder="https://..." />
                </div>
            </div>

            {/* ROW 2: MISSION STATEMENT */}
            <div className="edit-input-group full-width box-grow-small">
                <label>Mission Statement</label>
                <textarea name="missionStatement" value={formData.missionStatement || ''} onChange={handleChange} required></textarea>
            </div>

            {/* ROW 3: CHECKBOXES */}
            <div className="checkbox-grid-edit">
                {targetGroups.map((group) => (
                    <label key={group} className="checkbox-item-edit">
                        <input type="checkbox" value={group} onChange={handleCheckboxChange} checked={formData.beneficiaries.includes(group)}/>
                        {group}
                    </label>
                ))}
            </div>

            {/* ROW 4: DESCRIPTION */}
            <div className="edit-input-group full-width box-grow-large">
                <label>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange}></textarea>
            </div>
            <div className="edit-form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate('/ngo-dashboard')}>Cancel</button>
                <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : "PUBLISH PROFILE"}</button>
            </div>
        </form>
      </div>
    </div>
  );
}