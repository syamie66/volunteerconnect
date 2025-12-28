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

  // --- 1. Fetch Events from Firestore ---
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc")); 
    const unsubscribe = onSnapshot(query(collection(db, "events"), orderBy("date", "asc")), (snapshot) => {
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
    let eventDateObj = null;
    if (event.date) {
        eventDateObj = typeof event.date.toDate === 'function' 
            ? event.date.toDate() 
            : new Date(event.date);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!eventDateObj || isNaN(eventDateObj) || eventDateObj < today) {
        return false;
    }

    const term = searchTerm.toLowerCase();
    const title = event.title?.toLowerCase() || "";
    const loc = event.location?.toLowerCase() || "";
    const org = event.organization?.toLowerCase() || "";

    return title.includes(term) || loc.includes(term) || org.includes(term);
  });

  return (
    <div className="ep-wrapper">
      
      {/* 1. TOP BRAND DECO SECTION */}
      <div className="ep-top-nav-deco">
        <span>VolunteerConnect Community</span>
        <span>Est. 2025</span>
        <span>Community First Initiative</span>
      </div>
      
      <hr className="ep-section-line" />

      {/* 2. HERO TITLE SECTION (Editorial Two-Column) */}
      <header className="ep-hero-editorial">
        <div className="ep-hero-content">
          <h1 className="ep-editorial-title">
            We facilitate change through active volunteering.
          </h1>
          <div className="ep-hero-meta">
             <p className="ep-subtitle-editorial">
               Elevating social causes through strategic community engagement and vibrant innovation.
             </p>
          </div>
        </div>
        
        {/* THE CSS-DRIVEN IMAGE AREA */}
        <div className="ep-hero-image-visual"></div>
      </header>

      <hr className="ep-section-line" />

      {/* 3. SEARCH & FILTER STRIP */}
      <section className="ep-filter-strip">
        <div className="ep-filter-label">
            Available Opportunities ({filteredEvents.length})
        </div>
        <div className="ep-search-container-editorial">
          <input 
            type="text" 
            className="ep-search-input-editorial"
            placeholder="SEARCH EVENTS OR LOCATION..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <hr className="ep-section-line" />

      {/* 4. EVENTS GRID */}
      <section className="ep-events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No upcoming events found.</p>
          </div>
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

      <hr className="ep-section-line" />

      {/* 5. FOOTER DECO */}
      <footer className="ep-footer">
        <div className="ep-big-logo">
            volunteer connect
        </div>
      </footer>

    </div>
  );
}