// pages/Events.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import EventForm from "../components/EventForm";

export default function Events() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingJoin, setLoadingJoin] = useState({});

  // Fetch events in real-time
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // Join event
  const handleJoin = async (eventId) => {
    if (!currentUser) return;
    setLoadingJoin((prev) => ({ ...prev, [eventId]: true }));

    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(currentUser.uid),
      });
      alert("You have joined the event!");
    } catch (err) {
      console.error("Error joining event:", err);
      alert("Failed to join the event. Try again.");
    } finally {
      setLoadingJoin((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="events-page" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Events</h1>

      {/* NGO can create events */}
      {profile?.userType === "NGO" && <EventForm currentUser={currentUser} profile={profile} />}

      {profile?.userType === "volunteer" && <p>You can join events below.</p>}
      {!currentUser && <p>Please log in to see and join events.</p>}

      <hr />

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Date & Time</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>NGO Name</th>
              <th style={thStyle}>Participants</th>
              {profile?.userType === "volunteer" && <th style={thStyle}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const joined = event.participants?.includes(currentUser?.uid);
              return (
                <tr key={event.id} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                  <td style={tdStyle}>{event.title}</td>
                  <td style={tdStyle}>{event.description}</td>
                  <td style={tdStyle}>{event.date} {event.time}</td>
                  <td style={tdStyle}>{event.location}</td>
                  <td style={tdStyle}>{event.ngoName || "Unknown"}</td>
                  <td style={tdStyle}>{event.participants?.length || 0}</td>
                  {profile?.userType === "volunteer" && (
                    <td style={tdStyle}>
                      {!joined ? (
                        <button
                          onClick={() => handleJoin(event.id)}
                          disabled={loadingJoin[event.id]}
                        >
                          {loadingJoin[event.id] ? "Joining..." : "Join"}
                        </button>
                      ) : (
                        <span style={{ color: "green" }}>Joined</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Table styles
const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
