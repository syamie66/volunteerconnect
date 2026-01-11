import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './NGODashboard.css';

export default function NGODashboard() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
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

  const getEventStatus = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const eventDate = new Date(dateString);
    
    return eventDate < today ? 'Completed' : 'Ongoing';
  };

  // --- CALCULATE REAL STATS ---
  // ✅ UPDATED LOGIC:
  // We sum the 'approvedCount' field.
  // 1. Pending users are NOT counted here.
  // 2. Approved users ARE counted.
  // 3. If an approved user cancels, Dashboard.js decrements this field, so the count drops automatically.
  const totalParticipants = events.reduce((acc, event) => {
    return acc + (parseInt(event.approvedCount) || 0);
  }, 0);

  const activeEventsCount = events.length;
  const eventGoal = 10;
  const volunteerGoal = 50;

  if (loading) return <div className="ngo-loader">Loading Dashboard...</div>;

  // --- RESTRICTED VIEW: If NGO is Disabled ---
  if (profile?.disabled) {
      return (
          <div className="ngo-layout-container" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', backgroundColor:'#f0fdf4' }}>
              <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <h2 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Organization Account Restricted</h2>
                  <p style={{ color: '#374151', marginBottom: '0.5rem'}}>Your organization account has been disabled by the administrator.</p>
                  <p style={{ color: '#4b5563'}}>You cannot manage events or access the dashboard at this time.</p>
              </div>
          </div>
      );
  }

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
          <button className="nav-item" onClick={() => navigate('/ngo-profile')}>
            <span className="icon">👤</span> My Profile
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="ngo-main-content">
        
        <header className="main-header">
          <div className="header-text">
            <h1>NGO Dashboard</h1>
            <span className="status-badge">Active Status</span>
          </div>
          <div className="header-user">
            <span>Welcome, <strong>{profile?.orgName || 'Partner'}</strong></span>
            <div className="user-avatar" onClick={() => navigate('/ngo-profile')}>
                {profile?.photoURL ? <img src={profile.photoURL} alt="profile"/> : '👤'}
            </div>
          </div>
        </header>

        {/* Middle Stats Section */}
        <div className="stats-grid">
          <div className="stat-card big-stat">
            <h3>Engagement Overview</h3>
            <div className="stat-bars-visual">
                <div className="stat-item">
                    <span className="label">Total Events</span>
                    <div className="bar-container">
                      <div 
                        className="bar fill-pink" 
                        style={{ width: `${Math.min((activeEventsCount / eventGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="num">{activeEventsCount}</span>
                </div>
                <div className="stat-item">
                    <span className="label">Total Application</span>
                    <div className="bar-container">
                      <div 
                        className="bar fill-green" 
                        style={{ width: `${Math.min((totalParticipants / volunteerGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="num">{totalParticipants}</span>
                </div>
            </div>
          </div>

          <div className="stat-card action-card">
             <h3>Quick Action</h3>
             <p>Ready to make an impact today?</p>
             <button className="btn-primary" onClick={() => navigate('/create-event')}>
               + New Event 🌱
             </button>
          </div>
        </div>

        {/* Bottom Section: The Table List */}
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
                filteredEvents.map(ev => {
                  const status = getEventStatus(ev.date);
                  return (
                    <div key={ev.id} className="table-row">
                      <div className="col date">{ev.date}</div>
                      <div className="col title"><strong>{ev.title}</strong></div>
                      <div className="col loc">{ev.location}</div>
                      
                      <div className="col action">
                         <span className={status === 'Ongoing' ? "badge-pink" : "badge-completed"}>
                           {status}
                         </span>
                      </div>
                      
                      <div className="col manage action-buttons">
                          <button className="btn-text edit" onClick={() => navigate(`/event/${ev.id}/edit`)}>Edit</button>
                          <button className="btn-text view" onClick={() => navigate(`/event/${ev.id}/participants`)}>Participants</button>
                          <button className="btn-text delete" onClick={() => handleDelete(ev.id)}>Delete</button>
                      </div>
                    </div>
                  );
                })
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
                        <span className="ts">Current</span>
                        <p>{totalParticipants} Volunteers</p>
                    </div>
                </div>
            </div>

            <button className="btn-full-white" onClick={() => navigate('/edit-ngo-profile')}>
                Edit Profile
            </button>
        </div>
      </aside>
    </div>
  );
}