// components/EventForm.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function EventForm({ currentUser, profile }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        date,
        time,
        location,
        createdBy: currentUser.uid,
        ngoName: profile?.name || "Unknown NGO", // store NGO name
        participants: [],
        createdAt: serverTimestamp(),
      });

      setMessage("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
    } catch (err) {
      console.error("Error creating event:", err);
      setMessage("Failed to create event. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="event-form">
      <h2>Create Event</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

