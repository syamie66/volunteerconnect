import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { 
    collection, 
    getDocs, 
    doc, 
    onSnapshot, 
    runTransaction, 
} from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State for Chart Filter (Default to Current Year)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    useEffect(() => {
        if (!currentUser) return;

        // 1. Listen to User Profile
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserInfo(docSnap.data());
            }
        });

        // 2. Fetch Events
        const fetchEvents = async () => {
            try {
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
        fetchEvents();

        return () => unsubscribeUser();
    }, [currentUser]);

    const getStatus = (eventId) => {
        const registration = userInfo?.eventRegistrations?.[eventId];
        return registration?.status || "Pending";
    };

    // --- MAIN LOGIC: CANCEL APPLICATION ---
    const handleCancelApplication = async (eventId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel your application?");
        if (!confirmCancel) return;

        try {
            await runTransaction(db, async (transaction) => {
                const eventRef = doc(db, "events", eventId);
                const userRef = doc(db, "users", currentUser.uid);

                const eventDoc = await transaction.get(eventRef);
                const userDoc = await transaction.get(userRef);

                if (!eventDoc.exists() || !userDoc.exists()) throw "Document missing!";

                const eventData = eventDoc.data();
                const userData = userDoc.data();

                const regData = userData.eventRegistrations ? userData.eventRegistrations[eventId] : null;
                const currentStatus = regData ? regData.status : "Pending";
                const isApproved = currentStatus && currentStatus.toLowerCase() === 'approved';

                const newParticipants = (eventData.participants || []).filter(uid => uid !== currentUser.uid);
                
                let newApprovedCount = parseInt(eventData.approvedCount) || 0;
                if (isApproved && newApprovedCount > 0) {
                    newApprovedCount -= 1;
                }

                const newRegistrations = { ...userData.eventRegistrations };
                delete newRegistrations[eventId];

                transaction.update(eventRef, {
                    participants: newParticipants,
                    approvedCount: newApprovedCount
                });

                transaction.update(userRef, {
                    eventRegistrations: newRegistrations
                });
            });

            setAppliedEvents(prev => prev.filter(e => e.id !== eventId));
            alert("Application cancelled successfully.");

        } catch (error) {
            console.error("Cancellation failed:", error);
            alert("Failed to cancel application.");
        }
    };

    const isEventCompleted = (event) => {
        const status = getStatus(event.id);
        if (!status || status.toLowerCase() !== 'approved') return false;
        const today = new Date().setHours(0,0,0,0);
        const eventDate = new Date(event.date).setHours(0,0,0,0);
        return eventDate < today;
    };
    
    const completedEvents = appliedEvents.filter(event => isEventCompleted(event));
    const upcomingEvents = appliedEvents.filter(event => !isEventCompleted(event));
    
 
    const getAvailableYears = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2020; 
        const years = new Set();

        // 1. Add standard range (Current -> 2020)
        for (let y = currentYear; y >= startYear; y--) {
            years.add(y);
        }

        // 2. Also include years from actual data if they are older than 2020
        completedEvents.forEach(e => {
            const eventYear = new Date(e.date).getFullYear();
            years.add(eventYear);
        });

        // Return sorted descending (2025, 2024, 2023...)
        return Array.from(years).sort((a, b) => b - a);
    };

    // ✅ CHART LOGIC: Filter by Selected Year
    const getMonthlyData = () => {
        const counts = new Array(12).fill(0);
        
        completedEvents.forEach(event => {
            const eventDate = new Date(event.date);
            if (eventDate.getFullYear() === selectedYear) {
                const monthIndex = eventDate.getMonth();
                counts[monthIndex]++;
            }
        });

        const max = Math.max(...counts, 1);
        return counts.map(count => ({ count, height: max === 0 ? 0 : (count / max) * 100 }));
    };

    if (loading) return <div className="dashboard-scope"><p>Loading...</p></div>;

    if (userInfo?.disabled) {
        return (
            <div className="dashboard-scope" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh' }}>
                <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Account Restricted</h2>
                    <p style={{ color: '#374151', marginBottom: '0.5rem'}}>Your account has been disabled by the administrator.</p>
                    <p style={{ color: '#4b5563'}}>You cannot access the dashboard or apply for events at this time.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="dashboard-scope">
            <aside className="sidebar">
                <div className="logo-section"><h2>VOLUN<span>TEER</span></h2></div>
                <nav className="nav-menu">
                    <Link to="/dashboard" className="nav-item active">DASHBOARD</Link>
                    <Link to="/profile/update" className="nav-item">MY PROFILE</Link>
                    <Link to="/events" className="nav-item">FIND EVENTS</Link>
                    <button className="nav-item logout-item">LOGOUT</button>
                </nav>
            </aside>
            <main className="main-content">
                <header className="top-bar">
                    <div className="welcome-text"><h1>WELCOME BACK, {userInfo?.name?.toUpperCase() || "USER"}!</h1><p>HERE IS YOUR VOLUNTEER OVERVIEW</p></div>
                    <Link to="/events" className="cta-btn">JOIN NEW EVENT</Link>
                </header>
                
                <section className="activity-container">
                    <div className="content-card chart-card">
                        {/* Header with Year Dropdown */}
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>ACTIVITY PER MONTH</h3>
                            
                            <select 
                                value={selectedYear} 
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#f9fafb',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    cursor: 'pointer'
                                }}
                            >
                                {getAvailableYears().map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="chart-visual">
                            {getMonthlyData().map((data, index) => (
                                <div key={months[index]} className="chart-bar-container">
                                    <div className="chart-bar" style={{ height: `${data.height}%` }} title={`${data.count} Events in ${selectedYear}`}></div>
                                    <span className="chart-label">{months[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="expanded-events-grid">
                    <section className="content-card event-section">
                        <div className="card-header"><h3>UPCOMING EVENTS ({upcomingEvents.length})</h3></div>
                        <div className="scrollable-list">
                            {upcomingEvents.length === 0 ? <div className="empty-state">NO UPCOMING EVENTS</div> : 
                                upcomingEvents.map(event => {
                                    const status = getStatus(event.id);
                                    const isRejected = status.toLowerCase() === 'rejected';
                                    return (
                                        <div key={event.id} className="event-row">
                                            <div className="date-box"><span className="d-day">{new Date(event.date).getDate()}</span><span className="d-month">{months[new Date(event.date).getMonth()]}</span></div>
                                            <div className="event-info"><h4>{event.title.toUpperCase()}</h4><p>{event.location?.toUpperCase() || "REMOTE"}</p></div>
                                            <div className="action-group">
                                                <span className={`status-tag ${status.toLowerCase()}`}>{status.toUpperCase()}</span>
                                                {!isRejected && (
                                                    <button className="cancel-btn" onClick={() => handleCancelApplication(event.id)}>CANCEL APPLICATION</button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </section>
                    <section className="content-card event-section">
                        <div className="card-header"><h3>COMPLETED HISTORY ({completedEvents.length})</h3></div>
                        <div className="scrollable-list">
                            {completedEvents.length === 0 ? <div className="empty-state">NO COMPLETED EVENTS</div> : 
                                completedEvents.map(event => (
                                    <div key={event.id} className="event-row completed">
                                        <div className="event-info"><h4>{event.title.toUpperCase()}</h4><p>COMPLETED ON {event.date}</p></div>
                                        <span className="status-tag done">DONE</span>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}