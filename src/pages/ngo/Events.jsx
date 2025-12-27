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
import './EventsPublic.css'; // Green/Pink Theme

export default function Events() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingJoin, setLoadingJoin] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); 

  // --- 1. Fetch Events from Firestore ---
  useEffect(() => {
    // Order by date desc so we get them all, but we will filter in JS
    const q = query(collection(db, "events"), orderBy("date", "asc")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
      }));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. Handle Join Logic ---
  const handleJoin = async (eventId) => {
    if (!currentUser) {
        alert("Please login to join events.");
        return;
    }
    if (profile?.userType !== "volunteer") {
        alert("Only volunteers can join events.");
        return;
    }

    setLoadingJoin((prev) => ({ ...prev, [eventId]: true }));
    
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(currentUser.uid),
      });
      alert("You have successfully joined the event!");
    } catch (err) {
      console.error(err);
      alert("Failed to join the event. Please try again.");
    } finally {
      setLoadingJoin((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  // --- 3. Filter Logic (Search + Date Check) ---
  const filteredEvents = events.filter((event) => {
    
    // --- A. Date Filter: Remove Past Events ---
    let eventDateObj = null;
    if (event.date) {
        // Handle Firestore Timestamp or String Date
        eventDateObj = typeof event.date.toDate === 'function' 
            ? event.date.toDate() 
            : new Date(event.date);
    }

    // Get "Today" at midnight (00:00:00) so we don't hide events happening today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If date is invalid or in the past, return false (hide it)
    if (!eventDateObj || isNaN(eventDateObj) || eventDateObj < today) {
        return false;
    }

    // --- B. Search Term Filter ---
    const term = searchTerm.toLowerCase();
    const title = event.title?.toLowerCase() || "";
    const loc = event.location?.toLowerCase() || "";
    const org = event.organization?.toLowerCase() || "";

    return title.includes(term) || loc.includes(term) || org.includes(term);
  });

  return (
    <div className="ep-wrapper">
      
      {/* HERO / HEADER */}
      <header className="ep-hero">
        <h1 className="ep-main-title">Find Your Cause</h1>
        <p className="ep-subtitle">Join hands with organizations & make a difference</p>
        
        {/* Search Bar */}
        <div className="ep-search-container">
          <input 
            type="text" 
            className="ep-search-input"
            placeholder="SEARCH EVENTS OR LOCATION..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* EVENTS GRID */}
      <section className="ep-events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events"><p>No upcoming events found.</p></div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUser={currentUser}
              profile={profile}
              loading={loadingJoin[event.id]}
              onJoin={handleJoin}
            />
          ))
        )}
      </section>

      {/* FOOTER DECO */}
      <footer className="ep-footer">
        <div className="ep-big-logo">
           volunteer connect
        </div>
      </footer>

    </div>
  );
}