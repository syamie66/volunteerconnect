import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './EditEvent.css'; 

const PENANG_CITIES = [
  "Air Itam", "Balik Pulau", "Batu Ferringhi", "Batu Kawan", "Batu Maung",
  "Bayan Baru", "Bayan Lepas", "Bukit Mertajam", "Butterworth", "Gelugor",
  "George Town", "Jelutong", "Juru", "Kepala Batas", "Nibong Tebal",
  "Paya Terubong", "Perai", "Permatang Pauh", "Seberang Jaya", "Simpang Ampat",
  "Sungai Ara", "Sungai Dua", "Tanjung Bungah", "Tasek Gelugor", "Teluk Bahang"
];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '', organization: '', date: '', startTime: '', endTime: '',
    city: '', location: '', description: '', 
    registrationStart: '', registrationEnd: '',
    maxParticipants: '', imageUrl: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({ ...data, city: data.city || '' });
        } else {
          navigate('/dashboard/ngo');
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'events', id), formData);
      alert("Event updated successfully!");
      navigate('/dashboard/ngo');
    } catch (error) { alert("Failed to update."); } 
    finally { setSaving(false); }
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

  if (loading) return <div className="compact-body"><p>Loading...</p></div>;

  return (
    <div className="compact-body">
      <div className="compact-container">
        
        {/* Header */}
        <div className="compact-header">
          <h2>✏️ Edit Event</h2>
          <div className="compact-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard/ngo')}>Cancel</button>
            <button type="button" className="btn-save" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="compact-grid">
          <form className="compact-form">
            
            {/* Row 1 */}
            <div className="form-group span-2">
              <label>Event Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input type="text" name="organization" value={formData.organization} onChange={handleChange} />
            </div>

            {/* Row 2 */}
            <div className="form-group">
              <label>City</label>
              <select name="city" value={formData.city} onChange={handleChange}>
                <option value="" disabled>Select</option>
                {PENANG_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group span-2">
              <label>Specific Venue</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>

            {/* Row 3 - Dates */}
            <div className="form-group">
              <label>Event Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </div>

            {/* Row 4 - Registration */}
            <div className="form-group">
              <label>Reg. Opens</label>
              <input type="date" name="registrationStart" value={formData.registrationStart} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Reg. Closes</label>
              <input type="date" name="registrationEnd" value={formData.registrationEnd} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} />
            </div>

            {/* Row 5 - Description */}
            <div className="form-group span-3">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" />
            </div>
          </form>

          {/* RIGHT: Preview Side */}
          <div className="compact-preview">
            <h3 className="preview-heading">Live Preview</h3>
            <div className="preview-card">
              <div className="p-date-box">
                <span className="p-day">{previewDate.day}</span>
                <span className="p-month">{previewDate.month}</span>
              </div>
              <div className="p-details">
                <span className="p-org">{formData.organization || 'Organization'}</span>
                <h4 className="p-title">{formData.title || 'Event Title Here'}</h4>
                <div className="p-meta">
                   <p>📍 {formData.location || 'Venue'}{formData.city ? `, ${formData.city}` : ''}</p>
                   <p>⏰ {formData.startTime || '--:--'} - {formData.endTime || '--:--'}</p>
                </div>
              </div>
            </div>
            <div className="p-footer">
               <span>Target Volunteers</span>
               <strong style={{color: '#557C55'}}>{formData.maxParticipants || 0} Pax</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}