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

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                const userRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) setUserInfo(docSnap.data());

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

    const isEventCompleted = (event) => {
        const status = userInfo?.eventRegistrations?.[event.id]?.status;
        if (status !== 'Approved') return false;
        const today = new Date().setHours(0,0,0,0);
        const eventDate = new Date(event.date).setHours(0,0,0,0);
        return eventDate < today;
    };

    const completedEvents = appliedEvents.filter(event => isEventCompleted(event));
    const upcomingEvents = appliedEvents.filter(event => !isEventCompleted(event));

    // Calculate Bar Heights (Monthly Activity)
    const getMonthlyData = () => {
        const counts = new Array(12).fill(0);
        completedEvents.forEach(event => {
            const monthIndex = new Date(event.date).getMonth();
            counts[monthIndex]++;
        });
        const max = Math.max(...counts, 1); // Avoid division by zero
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

                {/* --- EXPANDED EVENTS GRID (BIGGER) --- */}
                <div className="expanded-events-grid">
                    <section className="content-card event-section">
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
                                            <span className="d-day">{new Date(event.date).getDate()}</span>
                                            <span className="d-month">{months[new Date(event.date).getMonth()]}</span>
                                        </div>
                                        <div className="event-info">
                                            <h4>{event.title.toUpperCase()}</h4>
                                            <p>{event.location?.toUpperCase() || "REMOTE"}</p>
                                        </div>
                                        <span className={`status-tag ${userInfo?.eventRegistrations?.[event.id]?.status.toLowerCase()}`}>
                                            {userInfo?.eventRegistrations?.[event.id]?.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

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