import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from "../../contexts/AuthContext";

export default function CreateEvent() {
  const { currentUser, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Initialize state exactly like EditEvent
  const [formData, setFormData] = useState({
    title: '', 
    organization: profile?.organizationName || '', 
    date: '', 
    startTime: '', 
    endTime: '',
    location: '', 
    description: '', 
    registrationStart: '', 
    registrationEnd: '',
    maxParticipants: '', 
    imageUrl: ''
  });

  if (profile && profile.userType !== "NGO") {
    return <div className="event-checkout-wrapper"><p className="status-msg">Only NGOs can create events.</p></div>;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the event object
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

  // Helper for Preview Date
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
    <div className="event-checkout-wrapper">
      <div className="checkout-bg-pattern"></div>
      <div className="checkout-container">
        <header className="checkout-header">
          <h1>✨ Create New Event</h1>
        </header>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          
          {/* LEFT SIDE: Form Inputs */}
          <div className="checkout-form-side">
            
            {/* Basic Info */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Event Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Beach Cleanup" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Organization</label>
                  <input type="text" name="organization" value={formData.organization} onChange={handleChange} required />
                </div>
              </div>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Central Park" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="form-section">
              <h3 className="section-title">Date & Time</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Event Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="input-pill-wrapper">
                  <label>Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                </div>
                <div className="input-pill-wrapper">
                  <label>End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Registration Logic */}
            <div className="form-section">
              <h3 className="section-title">Registration Logic</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Opens</label>
                  <input type="date" name="registrationStart" value={formData.registrationStart} onChange={handleChange} required />
                </div>
                <div className="input-pill-wrapper">
                  <label>Closes</label>
                  <input type="date" name="registrationEnd" value={formData.registrationEnd} onChange={handleChange} required />
                </div>
                <div className="input-pill-wrapper">
                  <label>Capacity</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required placeholder="0" />
                </div>
              </div>
            </div>

            <button type="submit" className="purchase-btn" disabled={loading}>
              {loading ? "Creating..." : "Publish Event"}
            </button>
            <button type="button" className="purchase-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>

          {/* RIGHT SIDE: Live Preview */}
          <div className="checkout-summary-side">
            <div className="summary-card">
              <h3 className="section-title" style={{color:'#D8A7B1'}}>Preview</h3>
              
              <div className="preview-card-horizontal">
                 <div className="preview-date-box">
                    <span className="p-day">{previewDate.day}</span>
                    <span className="p-month">{previewDate.month}</span>
                 </div>
                 <div className="preview-content">
                    <span className="summary-org">{formData.organization || 'ORG NAME'}</span>
                    <h4 className="summary-title">{formData.title || 'Event Title'}</h4>
                    <div className="summary-desc">
                      <p>📍 {formData.location || 'Location'}</p>
                      {/* Simple preview logic here, real logic in EventCard */}
                      <p>⏰ {formData.startTime || 'Start'} - {formData.endTime || 'End'}</p>
                    </div>
                 </div>
              </div>

              <div className="detail-total">
                <span>Capacity</span>
                <span className="sage-text">{formData.maxParticipants || 0} Volunteers</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}