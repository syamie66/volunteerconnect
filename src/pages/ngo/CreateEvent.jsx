import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from "../../contexts/AuthContext";
import './CreateEvent.css';

const PENANG_CITIES = [
  "Air Itam", "Balik Pulau", "Batu Ferringhi", "Batu Kawan", "Batu Maung",
  "Bayan Baru", "Bayan Lepas", "Bukit Mertajam", "Butterworth", "Gelugor",
  "George Town", "Jelutong", "Juru", "Kepala Batas", "Nibong Tebal",
  "Paya Terubong", "Perai", "Permatang Pauh", "Seberang Jaya", "Simpang Ampat",
  "Sungai Ara", "Sungai Dua", "Tanjung Bungah", "Tasek Gelugor", "Teluk Bahang"
];

export default function CreateEvent() {
  const { currentUser, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', 
    organization: '', 
    date: '', 
    startTime: '', 
    endTime: '',
    city: '', 
    location: '', 
    description: '', 
    registrationStart: '', 
    registrationEnd: '',
    maxParticipants: '', 
    imageUrl: ''
  });

  useEffect(() => {
    const name = profile?.orgName || profile?.organizationName;
    if (name) {
      setFormData(prev => ({
        ...prev,
        organization: name
      }));
    }
  }, [profile]);

  // VALIDATION LOGIC 
  const isFormValid = 
    formData.title.trim() !== "" &&
    formData.date !== "" &&
    formData.startTime !== "" &&
    formData.endTime !== "" &&
    formData.city !== "" &&
    formData.location.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.registrationStart !== "" &&
    formData.registrationEnd !== "" &&
    formData.maxParticipants !== "";


  // 1. Check if user is NGO
  if (profile && profile.userType !== "NGO") {
    return (
      <div className="create-body" style={{ justifyContent: 'center', height: '100vh' }}>
        <div className="create-container" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Access Denied</h2>
          <p>Only registered NGOs can create events.</p>
          <button className="create-btn-cancel" onClick={() => navigate('/dashboard')}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 2. Check if NGO is VERIFIED
  if (profile && profile.status !== "Verified") {
    return (
      <div className="create-body" style={{ justifyContent: 'center', height: '80vh', alignItems: 'center', display: 'flex' }}>
        <div className="create-container" style={{ textAlign: 'center', padding: '50px', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ color: '#800020' }}>Verification Pending</h2>
          <p style={{ margin: '20px 0', lineHeight: '1.6', color: '#555' }}>
            Your organization is currently under review. <br/>
            You must be <strong>Verified</strong> by an Admin before you can publish events.
          </p>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '25px', fontSize: '0.9rem' }}>
            <strong>Current Status:</strong> <span style={{ color: '#d97706', fontWeight: 'bold' }}>{profile.status || "Pending Review"}</span>
          </div>
          <button 
            className="create-btn-publish" 
            onClick={() => navigate('/dashboard/ngo')}
            style={{ width: '100%' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // FORM LOGIC

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return; 

    setLoading(true);
    const currentOrgName = formData.organization || profile?.orgName || profile?.organizationName || "Organization";

    try {
      const newEvent = {
        ...formData,
        organization: currentOrgName,
        organizerId: currentUser.uid, 
        createdBy: currentUser.uid,
        createdAt: new Date(),
        participants: [],
        status: 'open'
      };

      await addDoc(collection(db, 'events'), newEvent);
      alert("Event created successfully!");
      navigate('/dashboard/ngo');
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const getPreviewDate = () => {
    if (!formData.date) return { day: '00', month: 'XXX' };
    const d = new Date(formData.date);
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };
  const previewDate = getPreviewDate();

  return (
    <div className="create-body">
      <div className="create-container">
        
        {/* Header */}
        <div className="create-header">
          <h2>✨ Create New Event</h2>
          <div className="create-actions">
            <button type="button" className="create-btn-cancel" onClick={() => navigate('/dashboard/ngo')}>Cancel</button>
            
            {/* SUBMIT BUTTON */}
            <button 
              type="button" 
              className="create-btn-publish" 
              onClick={handleSubmit} 
              disabled={loading || !isFormValid}
              style={{ 
                opacity: isFormValid ? 1 : 0.5, 
                cursor: isFormValid ? 'pointer' : 'not-allowed' 
              }}
            >
              {loading ? "Creating..." : "Publish Event"}
            </button>
          </div>
        </div>

        <div className="create-grid">
          {/* LEFT: Form Side */}
          <form className="create-form">
            
            <div className="create-group span-2">
              <label>Event Title <span style={{color:'red'}}>*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Beach Cleanup" required />
            </div>
            
            <div className="create-group">
              <label>Organization</label>
              <input 
                type="text" 
                name="organization" 
                value={formData.organization} 
                readOnly 
                placeholder={profile?.orgName ? "Loading..." : "Organization Name"}
                style={{ 
                  backgroundColor: '#e9ecef', 
                  cursor: 'default', 
                  color: '#495057',
                  fontWeight: '600'
                }}
              />
            </div>

            <div className="create-group">
              <label>City <span style={{color:'red'}}>*</span></label>
              <select name="city" value={formData.city} onChange={handleChange} required>
                <option value="" disabled>Select</option>
                {PENANG_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="create-group span-2">
              <label>Specific Venue <span style={{color:'red'}}>*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Esplanade" required />
            </div>

            {/* Dates */}
            <div className="create-group">
              <label>Event Date <span style={{color:'red'}}>*</span></label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="create-group">
              <label>Start Time <span style={{color:'red'}}>*</span></label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </div>
            <div className="create-group">
              <label>End Time <span style={{color:'red'}}>*</span></label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </div>

            {/* Registration */}
            <div className="create-group">
              <label>Reg. Opens <span style={{color:'red'}}>*</span></label>
              <input type="date" name="registrationStart" value={formData.registrationStart} onChange={handleChange} required />
            </div>
            <div className="create-group">
              <label>Reg. Closes <span style={{color:'red'}}>*</span></label>
              <input type="date" name="registrationEnd" value={formData.registrationEnd} onChange={handleChange} required />
            </div>
            <div className="create-group">
              <label>Capacity <span style={{color:'red'}}>*</span></label>
              <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} placeholder="0" required />
            </div>

            <div className="create-group span-3">
              <label>Description <span style={{color:'red'}}>*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" required />
            </div>
          </form>

          {/* RIGHT: Preview Side */}
          <div className="create-preview">
            <h3 className="create-preview-heading">Live Preview</h3>
            <div className="create-preview-card">
              <div className="cp-date-box">
                <span className="cp-day">{previewDate.day}</span>
                <span className="cp-month">{previewDate.month}</span>
              </div>
              <div className="cp-details">
                <span className="cp-org">{formData.organization || 'Organization'}</span>
                <h4 className="cp-title">{formData.title || 'Event Title Here'}</h4>
                <div className="cp-meta">
                    <p>📍 {formData.location || 'Venue'}{formData.city ? `, ${formData.city}` : ''}</p>
                    <p>⏰ {formData.startTime || '--:--'} - {formData.endTime || '--:--'}</p>
                </div>
              </div>
            </div>
            <div className="cp-footer">
               <span>Target Volunteers</span>
               <strong style={{color: '#557C55'}}>{formData.maxParticipants || 0} Pax</strong>
            </div>

            {/* Validation Message */}
            {!isFormValid && (
              <div style={{marginTop: '20px', padding: '10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', fontSize: '0.85rem', color: '#856404'}}>
                ⚠️ Please fill in all required fields marked with * to publish.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}