import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import EventCard from "../../components/EventCard"; 
import './EventsPublic.css';

export default function Events() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingJoin, setLoadingJoin] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  const handleJoin = async (eventId) => {
    if (!currentUser || profile?.userType !== "volunteer") return;
    setLoadingJoin((prev) => ({ ...prev, [eventId]: true }));
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(currentUser.uid),
      });
      alert("You have joined the event!");
    } catch (err) {
      console.error(err);
      alert("Failed to join the event.");
    } finally {
      setLoadingJoin((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    return (
      event.title?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term) ||
      event.organization?.toLowerCase().includes(term)
    );
  });

// ... (imports remain the same) ...
// ... (Events function logic remains the same) ...

  return (
    <>
      {/* --- THE FIX: This div sits behind the navbar and fills the screen --- */}
      <div className="events-wallpaper-fixed"></div>

      <div className="events-public-container">
        
        {/* HERO / SEARCH SECTION */}
        <div className="events-hero">
          <h1 className="events-title">Find Your Cause</h1>
          <p className="events-subtitle">Join hands with organizations and make a difference today.</p>
          
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search by event, location, or organization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="event-search-bar"
            />
            <button className="search-btn">Browse</button>
          </div>
        </div>

        {/* EVENTS GRID */}
        <div className="events-grid">
          {filteredEvents.length === 0 && (
            <p className="no-results">No events found matching "{searchTerm}"</p>
          )}
          
          {filteredEvents.map((event) => (
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
    </>
  );
}
