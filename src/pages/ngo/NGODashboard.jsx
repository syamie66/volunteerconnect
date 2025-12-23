import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './NGODashboard.css';

export default function NGODashboard() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [participantsMap, setParticipantsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    if (!currentUser) return;

    const q = collection(db, 'events');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.createdBy === currentUser.uid);

      setEvents(eventsData);
      
      const tempMap = {};
      eventsData.forEach(event => { tempMap[event.id] = event.participants || []; });
      setParticipantsMap(tempMap);
      
      setLoading(false); 
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", eventId));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate simple stats for the UI
  const totalParticipants = Object.values(participantsMap).reduce((acc, curr) => acc + curr.length, 0);
  const activeEventsCount = events.length;

  if (loading) return <div className="ngo-loader">Loading Dashboard...</div>;

  return (
    <div className="ngo-layout-container">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="ngo-sidebar">
        <div className="sidebar-header">
          <div className="logo-circle">🍃</div>
          <h2>VolunteerConnect</h2>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="icon">📊</span> Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/create-event')}>
            <span className="icon">➕</span> Create Event
          </button>
          {/* Navigate to Public Profile View */}
          <button className="nav-item" onClick={() => navigate('/ngo-profile')}>
            <span className="icon">👤</span> My Profile
          </button>
        </nav>

        <div className="sidebar-footer-card">
          <div className="support-illustration">🌸</div>
          <p>Need help?</p>
          <button className="btn-light">Contact Support</button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="ngo-main-content">
        
        {/* Top Header */}
        <header className="main-header">
          <div className="header-text">
            <h1>NGO Dashboard</h1>
            <span className="status-badge">Active Status</span>
          </div>
          <div className="header-user">
            <span>Welcome, <strong>{profile?.organizationName || 'Partner'}</strong></span>
            <div className="user-avatar" onClick={() => navigate('/ngo-profile')}>
                {profile?.photoURL ? <img src={profile.photoURL} alt="profile"/> : '👤'}
            </div>
          </div>
        </header>

        {/* Middle Stats Section */}
        <div className="stats-grid">
          {/* Left: Quick Stats */}
          <div className="stat-card big-stat">
            <h3>Engagement Overview</h3>
            <div className="stat-bars-visual">
                <div className="stat-item">
                    <span className="label">Total Events</span>
                    <div className="bar-container"><div className="bar fill-pink" style={{width: '60%'}}></div></div>
                    <span className="num">{activeEventsCount}</span>
                </div>
                <div className="stat-item">
                    <span className="label">Total Volunteers</span>
                    <div className="bar-container"><div className="bar fill-green" style={{width: '80%'}}></div></div>
                    <span className="num">{totalParticipants}</span>
                </div>
            </div>
          </div>

          {/* Right: Quick Action */}
          <div className="stat-card action-card">
             <h3>Quick Action</h3>
             <p>Ready to make an impact today?</p>
             <button className="btn-primary" onClick={() => navigate('/create-event')}>
                + New Event 🌱
             </button>
          </div>
        </div>

        {/* Bottom Section: The "Table" List */}
        <div className="events-table-section">
          <div className="table-header">
            <h3>Your Events</h3>
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-compact"
            />
          </div>

          <div className="custom-table">
            <div className="table-head-row">
              <div className="col date">Date</div>
              <div className="col title">Event</div>
              <div className="col loc">Location</div>
              <div className="col action">Status</div>
              <div className="col manage">Actions</div>
            </div>

            <div className="table-body">
              {filteredEvents.length === 0 ? (
                <div className="empty-row">No events found.</div>
              ) : (
                filteredEvents.map(ev => (
                  <div key={ev.id} className="table-row">
                    <div className="col date">{ev.date}</div>
                    <div className="col title"><strong>{ev.title}</strong></div>
                    <div className="col loc">{ev.location}</div>
                    <div className="col action">
                        <span className="badge-pink">Live</span>
                    </div>
                    <div className="col manage">
                       <button className="icon-btn" title="Edit" onClick={() => navigate(`/event/${ev.id}/edit`)}>✏️</button>
                       <button className="icon-btn" title="Participants" onClick={() => navigate(`/event/${ev.id}/participants`)}>👥</button>
                       <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(ev.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- RIGHT PANEL --- */}
      <aside className="ngo-right-panel">
        <div className="right-card-dark">
            <div className="toggle-switch">
                <span>NGO Mode</span>
                <div className="switch-knob"></div>
            </div>

            <div className="circular-progress">
                <div className="circle-inner">
                    <h3>84%</h3>
                    <span>Impact Goal</span>
                </div>
            </div>

            <div className="activity-list">
                <div className="activity-item">
                    <div className="icon-box">📅</div>
                    <div className="text">
                        <span className="ts">{new Date().toLocaleDateString()}</span>
                        <p>Dashboard Accessed</p>
                    </div>
                </div>
                <div className="activity-item">
                    <div className="icon-box">👥</div>
                    <div className="text">
                        <span className="ts">Update</span>
                        <p>{totalParticipants} Volunteers</p>
                    </div>
                </div>
            </div>

            {/* UPDATED LINK: Points to EditNGOProfile */}
            <button className="btn-full-white" onClick={() => navigate('/edit-ngo-profile')}>
                Edit Profile
            </button>
        </div>
      </aside>

    </div>
  );
}