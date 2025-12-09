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
import EventCard from "../components/EventCard";
import './EventsPublic.css';

export default function Events() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingJoin, setLoadingJoin] = useState({});

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = [];
      snapshot.forEach((doc) => eventsData.push({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  const handleJoin = async (eventId) => {
    if (!currentUser || profile?.role !== "volunteer") return;

    setLoadingJoin((prev) => ({ ...prev, [eventId]: true }));
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(currentUser.uid),
      });
      alert("You have joined the event!");
    } catch {
      alert("Failed to join the event.");
    } finally {
      setLoadingJoin((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="events-public-container">
      <h1 className="events-title">Upcoming Events</h1>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUser={currentUser}
            profile={profile}
            loading={loadingJoin[event.id]}
            onJoin={handleJoin}
          />
        ))}
      </div>
    </div>
  );
}
