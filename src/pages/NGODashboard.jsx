import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './NGODashboard.css';

export default function NGODashboard() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New search state
  const [participantsMap, setParticipantsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !profile) return;
    const q = collection(db, 'events');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const eventsData = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.createdBy === currentUser.uid);

      setEvents(eventsData);
      const tempMap = {};
      eventsData.forEach(event => { tempMap[event.id] = event.participants || []; });
      setParticipantsMap(tempMap);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser, profile]);

  // Logic to filter events based on search input
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser || !profile || loading) {
    return <div className="ngo-dashboard-wrapper"><p className="status-msg">🌱 Cultivating your dashboard...</p></div>;
  }

  return (
    <div className="ngo-dashboard-wrapper">
      <div className="dashboard-bg-overlay"></div>

      <header className="dashboard-header">
        <div className="header-badge">Community Impact</div>
        <h1 className="dashboard-title">Events</h1>

        {/* Search Bar Implementation */}
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
          <div className="tabs">
            <span className="tab active">Published ({filteredEvents.length})</span>
          </div>
          <button className="create-fab" onClick={() => navigate('/create-event')}>+</button>
        </div>
      </header>

      <main className="event-grid">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>No events match your search. 🔎</p>
          </div>
        ) : (
          filteredEvents.map(ev => (
            <div key={ev.id} className="event-card">
              <div className="card-content">
                <div className="card-label-row">
                  <span className="category-tag">{ev.organization || 'NGO Partner'}</span>
                  <span className="status-dot">Live</span>
                </div>
                <h3 className="event-card-title">{ev.title}</h3>
                <div className="event-info-list">
                  <p><span>📅</span> {ev.date}</p>
                  <p><span>📍</span> {ev.location}</p>
                </div>
                <p className="event-description-text">
                  {ev.description?.substring(0, 100)}...
                  <button className="read-more-link" onClick={() => setSelectedEvent(ev)}>Read More</button>
                </p>
              </div>

              <div className="card-footer">
                <button className="participant-summary-btn" onClick={() => navigate(`/event/${ev.id}/participants`)}>
                  <span className="leaf-icon">🌱</span>
                  {participantsMap[ev.id]?.length || 0} Volunteers Enrolled
                </button>
                <div className="card-actions">
                  <button className="action-btn edit" onClick={() => navigate(`/event/${ev.id}/edit`)}>Edit</button>
                  <button className="action-btn delete" onClick={() => {if(window.confirm('Delete?')) deleteDoc(doc(db, 'events', ev.id))}}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Popup Modal Logic remains the same */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>&times;</button>
            <span className="category-tag">{selectedEvent.organization}</span>
            <h2 className="modal-title">{selectedEvent.title}</h2>
            <div className="modal-info">📅 {selectedEvent.date} | 📍 {selectedEvent.location}</div>
            <div className="modal-body"><p>{selectedEvent.description}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}











