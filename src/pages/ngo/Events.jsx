import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import EventCard from "../../components/EventCard"; 
import './EventsPublic.css'; 

export default function Events() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Events from Firestore (Real-Time) ---
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc")); 
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. Filter Logic (Search + Date Check) ---
  const filteredEvents = events.filter((event) => {
    // A. Parse Date safely
    let eventDateObj = null;
    if (event.date) {
        eventDateObj = typeof event.date.toDate === 'function' 
            ? event.date.toDate() 
            : new Date(event.date);
    }

    // B. Filter out past events
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!eventDateObj || isNaN(eventDateObj) || eventDateObj < today) {
        return false;
    }

    // C. Search Filter
    const term = searchTerm.toLowerCase();
    const title = event.title?.toLowerCase() || "";
    const loc = event.location?.toLowerCase() || "";
    const org = event.organization?.toLowerCase() || "";
    const ngoName = event.ngoName?.toLowerCase() || "";

    return title.includes(term) || loc.includes(term) || org.includes(term) || ngoName.includes(term);
  });

  // Optional: Callback for when a user successfully joins via EventCard
  const onJoinSuccess = (eventId) => {
     // You can add a toast notification here if you like
     console.log("User joined event:", eventId);
  };

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
        {loading ? (
             <div className="no-events" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
                <p>Loading opportunities...</p>
             </div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-events" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
            <p>No upcoming events found matching your search.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUser={currentUser}
              profile={profile}
              onJoin={onJoinSuccess}
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