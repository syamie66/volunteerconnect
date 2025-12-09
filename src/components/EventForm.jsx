// components/EventForm.jsx
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './EventForm.css'; // Import CSS

export default function EventForm({ currentUser, profile }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setProgress(0);
    let imageUrl = "";

    try {
      if (image) {
        const storageRef = ref(storage, `events/${image.name}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgress(prog);
            },
            (error) => {
              console.error('Upload failed', error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await addDoc(collection(db, "events"), {
        title,
        description,
        date,
        time,
        location,
        imageUrl,
        createdBy: currentUser.uid,
        ngoName: profile?.name || "Unknown NGO",
        participants: [],
        createdAt: serverTimestamp(),
      });

      setMessage("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setImage(null);
      setProgress(0);
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
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          {progress > 0 && <p>Upload Progress: {progress}%</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}