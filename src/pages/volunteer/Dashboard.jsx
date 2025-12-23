import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchUserInfo = async () => {
            try {
                const userRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserInfo(docSnap.data());
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };

        const fetchAppliedEvents = async () => {
            try {
                const eventsRef = collection(db, "events");
                const eventsSnap = await getDocs(eventsRef);

                const events = eventsSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(event =>
                        event.participants?.includes(currentUser.uid)
                    );

                setAppliedEvents(events);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        Promise.all([fetchUserInfo(), fetchAppliedEvents()])
            .finally(() => setLoading(false));
    }, [currentUser]);

    const getHandle = (email) => {
        return email ? `@${email.split('@')[0]}` : '@user';
    };

    // Helper to check if event is completed
    const isEventCompleted = (event) => {
        const status = userInfo?.eventRegistrations?.[event.id]?.status;
        
        // 1. Check if status is Approved
        if (status !== 'Approved') return false;

        // 2. Check if date has passed
        const today = new Date();
        const eventDate = new Date(event.date); // Assumes YYYY-MM-DD format
        
        // Reset time to midnight for accurate comparison
        today.setHours(0,0,0,0);
        eventDate.setHours(0,0,0,0);

        return eventDate < today;
    };

    // Filter events
    const completedEvents = appliedEvents.filter(event => isEventCompleted(event));
    const upcomingEvents = appliedEvents.filter(event => !isEventCompleted(event));


    if (loading) return <div className="db-scope"><p className="loading-text">Loading...</p></div>;
    if (!currentUser) return <div className="db-scope"><p className="loading-text">Please login.</p></div>;

    return (
        <div className="db-scope">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    Hero Image Placeholder
                </div>
            </div>

            <div className="main-container">
                <div className="dashboard-grid">
                    
                    {/* LEFT COLUMN: Profile Card */}
                    <aside className="profile-column">
                        <div className="profile-card">
                            <div className="profile-header-visual">
                                <div className="avatar-circle">
                                    {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            </div>
                            
                            <div className="profile-identity">
                                <h2>{userInfo?.name || "User Name"}</h2>
                                <p className="user-handle">{getHandle(currentUser.email)}</p>
                                <p className="user-bio">{userInfo?.skills || "No bio/skills listed"}</p>
                            </div>

                            <div className="profile-details-list">
                                <div className="detail-row">
                                    <span className="icon">📍</span>
                                    <span>{userInfo?.address || "No Address"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="icon">📞</span>
                                    <span>{userInfo?.phone || "No Phone"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="icon">⚧</span>
                                    <span>{userInfo?.gender || "Not Specified"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="icon">🎂</span>
                                    <span>{userInfo?.age ? `${userInfo.age} Years Old` : "Age N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="icon">🆔</span>
                                    <span>IC: {userInfo?.icNumber || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="icon">🚑</span>
                                    <span className="emergency-text">SOS: {userInfo?.emergencyContact || "N/A"}</span>
                                </div>
                            </div>

                            <Link to="/profile/update" className="edit-profile-btn">
                                Edit Profile
                            </Link>
                        </div>
                    </aside>

                    {/* RIGHT COLUMN: Content */}
                    <main className="content-column">
                        <div className="tabs-header">
                            <button className="tab-btn active">My Participations</button>
                            <button className="tab-btn">Calendar</button>
                        </div>

                        {/* SECTION 1: UPCOMING / ACTIVE */}
                        <div className="events-list">
                            {upcomingEvents.length > 0 && (
                                <h3 className="section-header">Upcoming & Active</h3>
                            )}
                            
                            {upcomingEvents.length === 0 && completedEvents.length === 0 ? (
                                <div className="empty-state">No events joined yet.</div>
                            ) : (
                                upcomingEvents.map(event => (
                                    <div key={event.id} className="event-row-card">
                                        <div className="event-info">
                                            <h3>{event.title}</h3>
                                            <p>{event.date} • {event.time}</p>
                                        </div>
                                        <div className="event-status-container">
                                            <span className={`status-badge ${userInfo?.eventRegistrations?.[event.id]?.status || "Pending"}`}>
                                                {userInfo?.eventRegistrations?.[event.id]?.status || "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* SECTION 2: COMPLETED HISTORY */}
                        {completedEvents.length > 0 && (
                            <div className="events-list history-section">
                                <h3 className="section-header">Completed History</h3>
                                {completedEvents.map(event => (
                                    <div key={event.id} className="event-row-card completed-card">
                                        <div className="event-info">
                                            <h3>{event.title}</h3>
                                            <p>{event.date} • {event.time}</p>
                                        </div>
                                        <div className="event-status-container">
                                            <span className="status-badge Completed">
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </main>

                </div>
            </div>
        </div>
    );
}