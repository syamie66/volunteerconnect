import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import EventForm from "../../components/EventForm";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '', organization: '', date: '', startTime: '', endTime: '',
    location: '', description: '', registrationStart: '', registrationEnd: '',
    maxParticipants: '', imageUrl: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setFormData(docSnap.data());
        else navigate('/dashboard');
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'events', id), formData);
      alert("Event updated successfully!");
      navigate('/dashboard');
    } catch (error) { alert("Failed to update."); }
  };

  // Helper for Preview Card Date
  const getPreviewDate = () => {
    if (!formData.date) return { day: '00', month: 'XXX' };
    const d = new Date(formData.date);
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };
  const previewDate = getPreviewDate();

  if (loading) return <div className="event-checkout-wrapper"><p className="status-msg">Loading...</p></div>;

  return (
    <div className="event-checkout-wrapper">
      {/* Background Pattern from your CSS */}
      <div className="checkout-bg-pattern"></div>

      <div className="checkout-container">
        <header className="checkout-header">
          <h1>✏️ Edit Event</h1>
        </header>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          
          {/* LEFT SIDE: The Form */}
          <div className="checkout-form-side">
            
            {/* Section 1 */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Event Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Organization</label>
                  <input type="text" name="organization" value={formData.organization} onChange={handleChange} />
                </div>
              </div>
              
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="form-section">
              <h3 className="section-title">Date & Time</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Date</label>
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

            {/* Section 3 */}
            <div className="form-section">
              <h3 className="section-title">Registration Logic</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Opens</label>
                  <input type="date" name="registrationStart" value={formData.registrationStart} onChange={handleChange} />
                </div>
                <div className="input-pill-wrapper">
                  <label>Closes</label>
                  <input type="date" name="registrationEnd" value={formData.registrationEnd} onChange={handleChange} />
                </div>
                <div className="input-pill-wrapper">
                  <label>Capacity</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" className="purchase-btn">Save Changes</button>
            <button type="button" className="cancel-text-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>

          {/* RIGHT SIDE: Live Preview (Replaces Order Summary) */}
          <div className="checkout-summary-side">
            <div className="summary-card">
              <h3 className="section-title" style={{color:'#D8A7B1'}}>Live Preview</h3>
              
              {/* This mimics your Dashboard Card Style */}
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
                      <p>⏰ {formData.startTime} - {formData.endTime}</p>
                    </div>
                 </div>
              </div>

              <div className="detail-total">
                <span>Status</span>
                <span className="sage-text">Editing...</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}