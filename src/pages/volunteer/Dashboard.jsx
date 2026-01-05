import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    arrayRemove, 
    deleteField 
} from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                // Fetch User Data
                const userRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) setUserInfo(docSnap.data());

                // Fetch Events where user is a participant
                const eventsSnap = await getDocs(collection(db, "events"));
                const events = eventsSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(event => event.participants?.includes(currentUser.uid));

                setAppliedEvents(events);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    // --- HELPER: GET STATUS SAFELY ---
    const getStatus = (eventId) => {
        // Access the nested registration object
        const registration = userInfo?.eventRegistrations?.[eventId];
        // Return status if it exists, otherwise default to "Pending"
        return registration?.status || "Pending";
    };

    // --- HANDLE CANCEL APPLICATION ---
    const handleCancelApplication = async (eventId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel your application for this event?");
        if (!confirmCancel) return;

        try {
            // 1. Remove user ID from the Event's 'participants' array
            const eventRef = doc(db, "events", eventId);
            await updateDoc(eventRef, {
                participants: arrayRemove(currentUser.uid)
            });

            // 2. Remove the specific event key from the User's 'eventRegistrations' map
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                [`eventRegistrations.${eventId}`]: deleteField()
            });

            // 3. Update Local State (UI) immediately
            setAppliedEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
            
            // Update userInfo state to remove the status tag immediately
            const updatedUserInfo = { ...userInfo };
            if (updatedUserInfo.eventRegistrations) {
                delete updatedUserInfo.eventRegistrations[eventId];
            }
            setUserInfo(updatedUserInfo);

            alert("Application cancelled successfully.");

        } catch (error) {
            console.error("Error cancelling application:", error);
            alert("Failed to cancel application. Please try again.");
        }
    };

    // --- HELPER: CHECK IF EVENT IS COMPLETED ---
    const isEventCompleted = (event) => {
        const status = getStatus(event.id);
        // Logic: Event is complete if status is Approved AND date has passed
        if (status !== 'Approved') return false;
        
        const today = new Date().setHours(0,0,0,0);
        const eventDate = new Date(event.date).setHours(0,0,0,0);
        return eventDate < today;
    };

    const completedEvents = appliedEvents.filter(event => isEventCompleted(event));
    const upcomingEvents = appliedEvents.filter(event => !isEventCompleted(event));

    // --- HELPER: CHART DATA ---
    const getMonthlyData = () => {
        const counts = new Array(12).fill(0);
        completedEvents.forEach(event => {
            const monthIndex = new Date(event.date).getMonth();
            counts[monthIndex]++;
        });
        const max = Math.max(...counts, 1);
        return counts.map(count => ({
            count,
            height: (count / max) * 100
        }));
    };

    if (loading) return <div className="dashboard-scope"><p className="loading-text">LOADING...</p></div>;

    return (
        <div className="dashboard-scope">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="logo-section">
                    <h2>VOLUN<span>TIER</span></h2>
                </div>
                <nav className="nav-menu">
                    <Link to="/dashboard" className="nav-item active">DASHBOARD</Link>
                    <Link to="/profile/update" className="nav-item">MY PROFILE</Link>
                    <Link to="/events" className="nav-item">FIND EVENTS</Link>
                    <button className="nav-item logout-item">LOGOUT</button>
                </nav>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="welcome-text">
                        <h1>WELCOME BACK, {userInfo?.name?.toUpperCase() || "USER"}!</h1>
                        <p>HERE IS YOUR VOLUNTEER OVERVIEW</p>
                    </div>
                    <Link to="/events" className="cta-btn">JOIN NEW EVENT</Link>
                </header>

                {/* --- ACTIVITY CHART SECTION --- */}
                <section className="activity-container">
                    <div className="content-card chart-card">
                        <div className="card-header">
                            <h3>ACTIVITY PER MONTH</h3>
                        </div>
                        <div className="chart-visual">
                            {getMonthlyData().map((data, index) => (
                                <div key={months[index]} className="chart-bar-container">
                                    <div 
                                        className="chart-bar" 
                                        style={{ height: `${data.height}%` }}
                                        title={`${data.count} Events`}
                                    ></div>
                                    <span className="chart-label">{months[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- EXPANDED EVENTS GRID --- */}
                <div className="expanded-events-grid">
                    
                    {/* UPCOMING EVENTS */}
                    <section className="content-card event-section">
                        <div className="card-header">
                            <h3>UPCOMING EVENTS ({upcomingEvents.length})</h3>
                        </div>
                        <div className="scrollable-list">
                            {upcomingEvents.length === 0 ? (
                                <div className="empty-state">NO UPCOMING EVENTS</div>
                            ) : (
                                upcomingEvents.map(event => {
                                    const status = getStatus(event.id); // Get status safely
                                    return (
                                        <div key={event.id} className="event-row">
                                            <div className="date-box">
                                                <span className="d-day">{new Date(event.date).getDate()}</span>
                                                <span className="d-month">{months[new Date(event.date).getMonth()]}</span>
                                            </div>
                                            
                                            <div className="event-info">
                                                <h4>{event.title.toUpperCase()}</h4>
                                                <p>{event.location?.toUpperCase() || "REMOTE"}</p>
                                            </div>

                                            {/* Status and Cancel Button Group */}
                                            <div className="action-group">
                                                {/* STATUS BADGE */}
                                                <span className={`status-tag ${status.toLowerCase()}`}>
                                                    {status.toUpperCase()}
                                                </span>
                                                
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={() => handleCancelApplication(event.id)}
                                                >
                                                    CANCEL APPLICATION
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* COMPLETED EVENTS */}
                    <section className="content-card event-section">
                        <div className="card-header">
                            <h3>COMPLETED HISTORY ({completedEvents.length})</h3>
                        </div>
                        <div className="scrollable-list">
                            {completedEvents.length === 0 ? (
                                <div className="empty-state">NO COMPLETED EVENTS</div>
                            ) : (
                                completedEvents.map(event => (
                                    <div key={event.id} className="event-row completed">
                                        <div className="event-info">
                                            <h4>{event.title.toUpperCase()}</h4>
                                            <p>COMPLETED ON {event.date}</p>
                                        </div>
                                        <span className="status-tag done">DONE</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}