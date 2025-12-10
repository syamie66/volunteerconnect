// components/EventForm.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import './EventForm.css'; // Import CSS

export default function EventForm({ currentUser, profile }) {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState(profile?.name || "");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // Event date
  const [time, setTime] = useState("");
  const [regStart, setRegStart] = useState(""); // Registration start
  const [regEnd, setRegEnd] = useState(""); // Registration end
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const penangCities = [
    "George Town",
    "Bayan Lepas",
    "Butterworth",
    "Bukit Mertajam",
    "Balik Pulau",
    "Seberang Jaya",
    "Batu Ferringhi",
    "Tanjung Tokong",
    "Gelugor",
    "Air Itam",
    "Perai",
    "Nibong Tebal",
    "Teluk Bahang",
    "Tasek Gelugor",
    "Juru",
    "Permatang Pauh",
    "Permatang Tinggi",
    "Sungai Bakap",
    "Simpang Ampat",
    "Kepala Batas",
    "Bertam"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !organization || !description || !date || !time || !location || !regStart || !regEnd) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "events"), {
        title,
        organization,
        description,
        date,
        time,
        location,
        registrationStart: regStart,
        registrationEnd: regEnd,
        createdBy: currentUser.uid,
        participants: [],
        createdAt: serverTimestamp(),
      });

      setMessage("Event created successfully!");
      setTitle("");
      setOrganization(profile?.name || "");
      setDescription("");
      setDate("");
      setTime("");
      setRegStart("");
      setRegEnd("");
      setLocation("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create event. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="event-form-container">
      <h2>Create Event</h2>
      {message && <p className="form-message">{message}</p>}
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Organization Name</label>
          <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Event Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Registration Start Date</label>
          <input type="date" value={regStart} onChange={(e) => setRegStart(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Registration End Date</label>
          <input type="date" value={regEnd} onChange={(e) => setRegEnd(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location (City in Penang)</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} required>
            <option value="">Select a city</option>
            {penangCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
