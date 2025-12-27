import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from "../../contexts/AuthContext";
import './CreateEvent.css'; // Importing the isolated CSS

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
    organization: profile?.organizationName || '', 
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

  if (profile && profile.userType !== "NGO") {
    return <div className="create-body"><p>Only NGOs can create events.</p></div>;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newEvent = {
        ...formData,
        organizerId: currentUser.uid, 
        createdBy: currentUser.uid,
        createdAt: new Date(),
        participants: [],
        status: 'open'
      };

      await addDoc(collection(db, 'events'), newEvent);
      alert("Event created successfully!");
      navigate('/dashboard');
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
            <button type="button" className="create-btn-cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="button" className="create-btn-publish" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Publish Event"}
            </button>
          </div>
        </div>

        <div className="create-grid">
          {/* LEFT: Form Side */}
          <form className="create-form">
            
            {/* Row 1 */}
            <div className="create-group span-2">
              <label>Event Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Beach Cleanup" />
            </div>
            <div className="create-group">
              <label>Organization</label>
              <input type="text" name="organization" value={formData.organization} onChange={handleChange} />
            </div>

            {/* Row 2 */}
            <div className="create-group">
              <label>City</label>
              <select name="city" value={formData.city} onChange={handleChange}>
                <option value="" disabled>Select</option>
                {PENANG_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="create-group span-2">
              <label>Specific Venue</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Esplanade" />
            </div>

            {/* Row 3 - Dates */}
            <div className="create-group">
              <label>Event Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="create-group">
              <label>Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
            </div>
            <div className="create-group">
              <label>End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </div>

            {/* Row 4 - Registration */}
            <div className="create-group">
              <label>Reg. Opens</label>
              <input type="date" name="registrationStart" value={formData.registrationStart} onChange={handleChange} />
            </div>
            <div className="create-group">
              <label>Reg. Closes</label>
              <input type="date" name="registrationEnd" value={formData.registrationEnd} onChange={handleChange} />
            </div>
            <div className="create-group">
              <label>Capacity</label>
              <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} placeholder="0" />
            </div>

            {/* Row 5 - Description */}
            <div className="create-group span-3">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" />
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
          </div>
        </div>

      </div>
    </div>
  );
}