// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import './Dashboard.css'; // <-- Make sure this file exists in the same folder

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserInfo = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) setUserInfo(docSnap.data());
    };

    const fetchAppliedEvents = async () => {
      const eventsRef = collection(db, "events");
      const eventsSnap = await getDocs(eventsRef);
      const events = eventsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.participants?.includes(currentUser.uid));
      setAppliedEvents(events);
    };

    Promise.all([fetchUserInfo(), fetchAppliedEvents()]).then(() => setLoading(false));
  }, [currentUser]);

  if (!currentUser) return <p className="loading-text">Please login to see your dashboard.</p>;
  if (loading) return <p className="loading-text">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">👤 Welcome, {userInfo?.name || currentUser.displayName}</h1>

      {/* Personal Information */}
      <section className="dashboard-card">
        <h2>Personal Information</h2>
        <p><strong>Full Name:</strong> {userInfo?.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Phone:</strong> {userInfo?.phone}</p>
        <p><strong>IC Number:</strong> {userInfo?.icNumber}</p>
        <p><strong>Address:</strong> {userInfo?.address}</p>
        <p><strong>Emergency Contact:</strong> {userInfo?.emergencyContact}</p>
      </section>

      {/* Participated Events */}
      <section className="dashboard-card">
        <h2>My Participations</h2>
        {appliedEvents.length === 0 ? (
          <p className="no-event">You haven't applied to any events yet.</p>
        ) : (
          <ul className="event-list">
            {appliedEvents.map(event => (
              <li key={event.id} className="event-item">
                <strong>{event.title}</strong> — {event.date} @ {event.time}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
