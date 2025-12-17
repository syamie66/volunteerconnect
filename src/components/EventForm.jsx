import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import './EventForm.css';

export default function EventForm({ currentUser, profile }) {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState(profile?.name || "");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [regStart, setRegStart] = useState("");
  const [regEnd, setRegEnd] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const penangCities = ["George Town", "Bayan Lepas", "Butterworth", "Bukit Mertajam", "Balik Pulau", "Seberang Jaya", "Batu Ferringhi", "Tanjung Tokong", "Gelugor", "Air Itam", "Perai", "Nibong Tebal", "Teluk Bahang", "Tasek Gelugor", "Juru", "Permatang Pauh", "Permatang Tinggi", "Sungai Bakap", "Simpang Ampat", "Kepala Batas", "Bertam"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !organization || !description || !date || !time || !location || !regStart || !regEnd) {
      setMessage("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title, organization, description, date, time, location,
        registrationStart: regStart, registrationEnd: regEnd,
        createdBy: currentUser.uid, participants: [], createdAt: serverTimestamp(),
      });
      setMessage("Event created successfully!");
      setTitle(""); setDescription(""); setDate(""); setTime(""); setRegStart(""); setRegEnd(""); setLocation("");
    } catch (err) {
      setMessage("Failed to create event. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="event-checkout-wrapper">
      {/* Background Wallpaper Pattern */}
      <div className="checkout-bg-pattern"></div>

      <div className="checkout-container">
        <header className="checkout-header">
          <h1>Create Event</h1>
          {message && <p className="status-msg">{message}</p>}
        </header>

        <div className="checkout-layout">
          {/* Left Side: The Form */}
          <form className="checkout-form-side" onSubmit={handleSubmit}>
            <section className="form-section">
              <h3 className="section-title">General Information</h3>
              <div className="input-row">
                <input type="text" placeholder="Event Title*" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Organization Name*" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
              </div>
              <textarea placeholder="Event Description*" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </section>

            <section className="form-section">
              <h3 className="section-title">Schedule & Location</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Event Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="input-pill-wrapper">
                  <label>Event Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
              <select value={location} onChange={(e) => setLocation(e.target.value)} required>
                <option value="">Select a City in Penang*</option>
                {penangCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </section>

            <section className="form-section">
              <h3 className="section-title">Registration Period</h3>
              <div className="input-row">
                <div className="input-pill-wrapper">
                  <label>Start Date</label>
                  <input type="date" value={regStart} onChange={(e) => setRegStart(e.target.value)} required />
                </div>
                <div className="input-pill-wrapper">
                  <label>End Date</label>
                  <input type="date" value={regEnd} onChange={(e) => setRegEnd(e.target.value)} required />
                </div>
              </div>
            </section>

            <button type="submit" className="purchase-btn" disabled={loading}>
              {loading ? "CREATING..." : "PUBLISH EVENT"}
            </button>
          </form>

          {/* Right Side: Event Preview (Mirroring the 'Your Order' section) */}
          <aside className="checkout-summary-side">
            <h3 className="section-title">Event Summary</h3>
            <div className="summary-card">
               <div className="summary-preview-content">
                  <span className="summary-org">{organization || "Your Organization"}</span>
                  <h2 className="summary-title">{title || "New Event Title"}</h2>
                  <p className="summary-desc">{description || "Event description will appear here..."}</p>
               </div>
               
               <div className="summary-details">
                  <div className="detail-item">
                    <span>Location</span>
                    <strong>{location || "Not specified"}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Date</span>
                    <strong>{date || "YYYY-MM-DD"}</strong>
                  </div>
                  <hr />
                  <div className="detail-total">
                    <span>Registration Status</span>
                    <strong className="sage-text">Open Soon</strong>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
