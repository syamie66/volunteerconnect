import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
// 1. Ensure deleteDoc is imported
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './NGODashboard.css';

export default function NGODashboard() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [participantsMap, setParticipantsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState({}); 

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !profile) return;
    const q = collection(db, 'events');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const eventsData = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.createdBy === currentUser.uid);

      setEvents(eventsData);
      
      // Calculate participants count for each event
      const tempMap = {};
      eventsData.forEach(event => { tempMap[event.id] = event.participants || []; });
      setParticipantsMap(tempMap);
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser, profile]);

  // --- DELETE FUNCTION ---
  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this event?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "events", eventId));
        // No need to manually remove from state; onSnapshot will update the list automatically.
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const getDateDetails = (dateStr) => {
    if (!dateStr) return { day: '--', month: '---', weekday: '---' };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { day: '??', month: '???', weekday: '???' };

    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      weekday: date.toLocaleString('default', { weekday: 'long' }).toUpperCase()
    };
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDescription = (id) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!currentUser || !profile || loading) {
    return <div className="ngo-dashboard-wrapper"><p className="status-msg">🌱 Cultivating your dashboard...</p></div>;
  }

  return (
    <div className="ngo-dashboard-wrapper">
      <div className="dashboard-bg-overlay"></div>

      <header className="dashboard-header">
        <div className="header-badge">Community Impact</div>
        <h1 className="dashboard-title">Events Calendar</h1>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            className="dashboard-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="dashboard-sub-nav">
          <button className="create-fab" onClick={() => navigate('/create-event')}>+</button>
        </div>
      </header>

      <main className="event-grid">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>No events match your search. 🔎</p>
          </div>
        ) : (
          filteredEvents.map(ev => {
            const isExpanded = expandedEvents[ev.id];
            const { day, month, weekday } = getDateDetails(ev.date);
            
            return (
              <div key={ev.id} className="event-card-horizontal">
                
                {/* LEFT: Date Box */}
                <div className="event-date-box">
                  <span className="event-date-day">{day}</span>
                  <span className="event-date-weekday">{weekday}</span>
                  <span className="event-date-month">{month}</span>
                </div>

                {/* RIGHT: Content */}
                <div className="event-details">
                  
                  <div className="event-header-row">
                     <div>
                       <span className="event-org">{ev.organization || 'NGO Partner'}</span>
                       <h3 className="event-name">{ev.title}</h3>
                     </div>
                     <span className="status-dot">● Live</span>
                  </div>

                  <div className="event-meta">
                    <div className="meta-row">
                      <span className="pink-icon">⏰</span> 
                      {ev.startTime || 'TBD'} - {ev.endTime || 'TBD'}
                    </div>
                    <div className="meta-row">
                      <span className="pink-icon">📍</span> 
                      {ev.location}
                    </div>
                  </div>

                  <div className="reg-compact-box">
                    <small>Registration: <span className="pink-accent">{ev.registrationStart}</span> ➜ <span className="pink-accent">{ev.registrationEnd}</span></small>
                  </div>

                  <div className="event-description-text">
                    {isExpanded ? ev.description : `${ev.description?.substring(0, 60)}...`}
                    {ev.description?.length > 60 && (
                      <button className="read-more" onClick={() => toggleDescription(ev.id)}>
                        {isExpanded ? 'Less' : 'More'}
                      </button>
                    )}
                  </div>

                  <div className="card-footer-styled">
                    <div className="participant-count">
                      <span className="pink-icon">👥</span>
                      {participantsMap[ev.id]?.length || 0} / {ev.maxParticipants || '∞'} Joined
                    </div>
                    
                    <div className="action-buttons">
                      {/* EDIT BUTTON */}
                      <button className="icon-btn edit" title="Edit" onClick={() => navigate(`/event/${ev.id}/edit`)}>✏️</button>
                      
                      {/* DELETE BUTTON (Now connected to handleDelete) */}
                      <button 
                        className="icon-btn delete" 
                        title="Delete" 
                        onClick={() => handleDelete(ev.id)}
                      >
                        🗑️
                      </button>
                      
                      <button className="join-btn" onClick={() => navigate(`/event/${ev.id}/participants`)}>View List</button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}