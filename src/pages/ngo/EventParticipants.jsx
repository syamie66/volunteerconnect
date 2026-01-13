import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayRemove, increment } from 'firebase/firestore';
import './EventParticipants.css';

export default function EventParticipants() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedParticipants, setExpandedParticipants] = useState({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventRef = doc(db, 'events', eventId);
                const eventSnap = await getDoc(eventRef);

                if (eventSnap.exists()) {
                    const eventData = eventSnap.data();
                    setEvent(eventData);

                    const participantsData = await Promise.all(
                        (eventData.participants || []).map(async (uid) => {
                            const userRef = doc(db, "users", uid);
                            const userSnap = await getDoc(userRef);

                            if (!userSnap.exists()) {
                                return null;
                            }

                            const user = userSnap.data();
                            const reg = user.eventRegistrations?.[eventId] || {};

                            return {
                                uid,
                                name: user.name || "Unknown",
                                email: user.email || "N/A",
                                phone: user.phone || "N/A",
                                icNumber: user.icNumber || "N/A",
                                address: user.address || "N/A",
                                emergencyContact: user.emergencyContact || "N/A",
                                gender: user.gender || "N/A",
                                skills: user.skills || "N/A",
                                status: reg.status || "Pending",
                                registeredDate: reg.registeredDate || "N/A",
                            };
                        })
                    );

                    const existingParticipants = participantsData.filter(p => p !== null);
                    setParticipants(existingParticipants);
                }
            } catch (error) {
                console.error("Error fetching participants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    // --- ACTIONS ---
    const toggleDetails = (uid) => {
        setExpandedParticipants((prev) => ({ ...prev, [uid]: !prev[uid] }));
    };

    const updateParticipantStatus = async (uid, currentStatus, newStatus) => {
        if(!window.confirm(`Mark this user as ${newStatus}?`)) return;
        setLoading(true);
        
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { [`eventRegistrations.${eventId}.status`]: newStatus });

            const eventRef = doc(db, 'events', eventId);

            if (newStatus === "Approved" && currentStatus !== "Approved") {
                await updateDoc(eventRef, { approvedCount: increment(1) });
            } 
            else if (newStatus === "Rejected" && currentStatus === "Approved") {
                await updateDoc(eventRef, { approvedCount: increment(-1) });
            }

            setParticipants(prev => prev.map(p => p.uid === uid ? { ...p, status: newStatus } : p));
        
        } catch (error) { 
            console.error(error);
            alert("Error updating status: " + error.message); 
        }
        setLoading(false);
    };

    const handleDelete = async (uid, name, currentStatus) => {
        if (!window.confirm(`Remove ${name} from this event?`)) return;
        setLoading(true);
        try {
            const eventRef = doc(db, "events", eventId);
            await updateDoc(eventRef, { participants: arrayRemove(uid) });

            if (currentStatus === "Approved") {
                await updateDoc(eventRef, { approvedCount: increment(-1) });
            }

            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                await updateDoc(userRef, { [`eventRegistrations.${eventId}`]: null });
            }

            setParticipants(prev => prev.filter(p => p.uid !== uid));
        } catch (error) { alert(error.message); }
        setLoading(false);
    };

    if (loading) return <div className="loading-state">🍵 Brewing data...</div>;
    if (!event) return <div className="error-state">Event not found.</div>;

    return (
        <div className="participants-container">
            <div className="header-section">
                <Link to="/dashboard/ngo" className="back-link">
                    ← Back to Dashboard
                </Link>
                <div className="title-block">
                    <h1>{event.title}</h1>
                    <div className="meta-badges">
                        <span>📅 {event.date}</span>
                        <span>📍 {event.location}</span>
                        <span className="count-badge">👥 {participants.length} Registrations</span>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="aesthetic-table">
                    <thead>
                        <tr>
                            {/* 1. Added numbering header */}
                            <th style={{ width: '50px' }}>#</th> 
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registered Date</th>
                            <th>Status</th>
                            <th className="action-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.length === 0 ? (
                            // 2. Updated colSpan to 6
                            <tr><td colSpan="6" className="empty-row">No participants found.</td></tr>
                        ) : (
                            // 3. Added index parameter
                            participants.map((p, index) => {
                                const isExpanded = expandedParticipants[p.uid];
                                return (
                                    <React.Fragment key={p.uid}>
                                        <tr className={`main-row ${isExpanded ? 'active-row' : ''}`}>
                                            {/* 4. Display numbering (index + 1) */}
                                            <td className="fw-bold">{index + 1}</td> 
                                            <td className="fw-bold">{p.name}</td>
                                            <td>{p.email}</td>
                                            <td>{p.registeredDate}</td>
                                            <td>
                                                <span className={`status-badge ${p.status.toLowerCase()}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="action-cell">
                                                <div className="btn-group">
                                                    <button 
                                                        className="tbl-btn view-btn" 
                                                        onClick={() => toggleDetails(p.uid)}
                                                    >
                                                        {isExpanded ? 'Hide' : 'View'}
                                                    </button>
                                                    
                                                    <button 
                                                        className="tbl-btn approve-btn" 
                                                        onClick={() => updateParticipantStatus(p.uid, p.status, "Approved")}
                                                        disabled={p.status === "Approved"}
                                                    >
                                                        Approve
                                                    </button>
                                                    
                                                    <button 
                                                        className="tbl-btn reject-btn" 
                                                        onClick={() => updateParticipantStatus(p.uid, p.status, "Rejected")}
                                                        disabled={p.status === "Rejected"}
                                                    >
                                                        Reject
                                                    </button>

                                                    <button 
                                                        className="tbl-btn delete-btn" 
                                                        onClick={() => handleDelete(p.uid, p.name, p.status)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="detail-row">
                                                {/* 5. Updated colSpan to 6 */}
                                                <td colSpan="6">
                                                    <div className="detail-grid">
                                                        <div><strong>Phone:</strong> {p.phone}</div>
                                                        <div><strong>IC Number:</strong> {p.icNumber}</div>
                                                        <div><strong>Gender:</strong> {p.gender}</div>
                                                        <div><strong>Address:</strong> {p.address}</div>
                                                        <div><strong>Emergency Contact:</strong> {p.emergencyContact}</div>
                                                        <div className="full-width"><strong>Skills:</strong> {p.skills}</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}