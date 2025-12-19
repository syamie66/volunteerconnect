dashboard.jsx

// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import './Dashboard.css'; 

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchUserInfo = async () => {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) setUserInfo(docSnap.data());
        };

        const fetchAppliedEvents = async () => {
            const eventsRef = collection(db, "events");
            const eventsSnap = await getDocs(eventsRef);
            
            const events = eventsSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(event => event.participants?.includes(currentUser.uid));
            
            setAppliedEvents(events);
        };

        Promise.all([fetchUserInfo(), fetchAppliedEvents()]).then(() => setLoading(false));
    }, [currentUser]);

    const getEventStatus = (eventId) => {
        return userInfo?.eventRegistrations?.[eventId]?.status  'Pending';
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'status-approved';
            case 'Rejected': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    if (!currentUser) return <p className="loading-text">Please login to see your dashboard.</p>;
    if (loading) return <p className="loading-text">Loading dashboard...</p>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">
                👤 Welcome, {userInfo?.name  currentUser.displayName  currentUser.email}
            </h1>

            {/* Personal Information */}
            <section className="dashboard-card user-info-card">
                <h2>Personal Information & Profile</h2>
                
                <div className="profile-details">
                    <p><strong>Full Name:</strong> {userInfo?.name  'N/A'}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Gender:</strong> {userInfo?.gender  'N/A'}</p>
                    <p><strong>Phone:</strong> {userInfo?.phone  'N/A'}</p>
                    <p><strong>IC Number:</strong> {userInfo?.icNumber  'N/A'}</p>
                    <p><strong>Address:</strong> {userInfo?.address  'N/A'}</p>
                    <p><strong>Emergency Contact:</strong> {userInfo?.emergencyContact  'N/A'}</p>
                    <p className="skills-area">
                        <strong>Skills/Expertise:</strong> {userInfo?.skills  'None listed'}
                    </p>
                </div>

                {/* Update Profile Button at the bottom */}
                <Link to="/profile/update" className="update-profile-btn">
                    Update Profile
                </Link> 
            </section>

            {/* Participated Events */}
            <section className="dashboard-card events-card">
                <h2>My Participations</h2>
                {appliedEvents.length === 0 ? (
                    <p className="no-event">You haven't applied to any events yet.</p>
                ) : (
                    <ul className="event-list">
                        {appliedEvents.map(event => {
                            const status = getEventStatus(event.id);
                            const statusClass = getStatusClass(status);
