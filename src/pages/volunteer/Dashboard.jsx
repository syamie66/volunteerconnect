import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

// Simple Icon Components to keep code clean
const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Profile: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Events: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  History: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Pin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Tool: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>,
  Alert: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        let userData = {};
        if (userSnap.exists()) {
          userData = userSnap.data();
          setUserInfo(userData);
        }

        const eventsRef = collection(db, "events");
        const eventsSnap = await getDocs(eventsRef);
        
        const allEvents = eventsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(event => event.participants?.includes(currentUser.uid));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const completed = [];

        allEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const userStatus = userData.eventRegistrations?.[event.id]?.status;

            if (userStatus === 'Approved' && eventDate < today) {
                completed.push(event);
            } else {
                upcoming.push(event);
            }
        });

        setUpcomingEvents(upcoming);
        setCompletedEvents(completed);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const getHandle = (email) => email ? `@${email.split('@')[0]}` : '@USER';

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="dashboard-scope">
      
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>VOLUN<span>TIER</span></h2>
        </div>

        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-item active">
             <span className="icon"><Icons.Dashboard /></span> DASHBOARD
          </Link>
          <Link to="/profile/update" className="nav-item">
             <span className="icon"><Icons.Profile /></span> MY PROFILE
          </Link>
          <Link to="/events" className="nav-item">
             <span className="icon"><Icons.Events /></span> FIND EVENTS
          </Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        
        {/* HEADER */}
        <header className="top-bar">
          <div className="welcome-text">
            <h1>WELCOME BACK, {userInfo?.name?.split(' ')[0]?.toUpperCase()}!</h1>
            <p>HERE IS YOUR VOLUNTEER OVERVIEW</p>
          </div>
          <button className="cta-btn" onClick={() => navigate('/events')}>
            JOIN NEW EVENT
          </button>
        </header>

        <div className="dashboard-grid">

          {/* LEFT: PROFILE CARD */}
          <div className="grid-column profile-column">
            <div className="content-card profile-card full-height">
              <div className="profile-header-visual">
                <div className="avatar-large">
                  {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2>{userInfo?.name || "User Name"}</h2>
                <span className="user-handle">{getHandle(currentUser?.email)}</span>
              </div>
              
              <div className="profile-details-list">
                <div className="detail-row">
                    <span className="icon-small"><Icons.Pin /></span>
                    <div className="detail-text">
                        <label>LOCATION</label>
                        <span>{userInfo?.address || "NO ADDRESS"}</span>
                    </div>
                </div>
                <div className="detail-row">
                    <span className="icon-small"><Icons.Phone /></span>
                    <div className="detail-text">
                        <label>PHONE</label>
                        <span>{userInfo?.phone || "NO PHONE"}</span>
                    </div>
                </div>
                <div className="detail-row">
                    <span className="icon-small"><Icons.Tool /></span>
                    <div className="detail-text">
                        <label>SKILLS</label>
                        <span>{userInfo?.skills || "NO SKILLS"}</span>
                    </div>
                </div>
                <div className="detail-row alert-row">
                    <span className="icon-small"><Icons.Alert /></span>
                    <div className="detail-text">
                        <label>EMERGENCY</label>
                        <span>{userInfo?.emergencyContact || "NO CONTACT"}</span>
                    </div>
                </div>
              </div>

              <Link to="/profile/update" className="secondary-btn">
                EDIT PROFILE
              </Link>
            </div>
          </div>

          {/* RIGHT: EVENTS */}
          <div className="grid-column events-column">
            
            {/* UPCOMING */}
            <div className="content-card event-section">
              <div className="card-header">
                <h3>UPCOMING EVENTS ({upcomingEvents.length})</h3>
              </div>
              <div className="scrollable-list">
                {upcomingEvents.length === 0 ? (
                    <div className="empty-state">NO UPCOMING EVENTS</div>
                ) : (
                    upcomingEvents.map(event => (
                        <div key={event.id} className="event-row">
                            <div className="date-box">
                                <span className="d-day">{event.date.split('-')[2]}</span>
                                <span className="d-month">DAY</span>
                            </div>
                            <div className="event-info">
                                <h4>{event.title}</h4>
                                <p>{event.location}</p>
                            </div>
                            <span className="status-tag pending">
                                {userInfo?.eventRegistrations?.[event.id]?.status || "PENDING"}
                            </span>
                        </div>
                    ))
                )}
              </div>
            </div>

            {/* COMPLETED */}
            <div className="content-card event-section">
              <div className="card-header">
                <h3>COMPLETED HISTORY ({completedEvents.length})</h3>
              </div>
              <div className="scrollable-list">
                {completedEvents.length === 0 ? (
                    <div className="empty-state">NO HISTORY YET</div>
                ) : (
                    completedEvents.map(event => (
                        <div key={event.id} className="event-row completed">
                            <div className="event-info">
                                <h4>{event.title}</h4>
                                <p>COMPLETED ON {event.date}</p>
                            </div>
                            <span className="status-tag done">DONE</span>
                        </div>
                    ))
                )}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}