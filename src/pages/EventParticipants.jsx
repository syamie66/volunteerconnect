import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import './EventParticipants.css';

export default function EventParticipants() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedParticipants, setExpandedParticipants] = useState({});

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchEvent = async () => {
            const eventRef = doc(db, 'events', eventId);
            const eventSnap = await getDoc(eventRef);

            if (eventSnap.exists()) {
                const eventData = eventSnap.data();
                setEvent(eventData);

                const participantsData = await Promise.all(
                    (eventData.participants || []).map(async (uid) => {
                        const userRef = doc(db, "users", uid);
                        const userSnap = await getDoc(userRef);
                        let user = userSnap.exists() ? userSnap.data() : {};
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
                setParticipants(participantsData);
            }
            setLoading(false);
        };
        fetchEvent();
    }, [eventId]);

    // --- ACTIONS ---
    const toggleDetails = (uid) => {
        setExpandedParticipants((prev) => ({ ...prev, [uid]: !prev[uid] }));
    };

    const updateParticipantStatus = async (uid, newStatus) => {
        if(!window.confirm(`Mark this user as ${newStatus}?`)) return;
        setLoading(true);
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { [`eventRegistrations.${eventId}.status`]: newStatus });
            setParticipants(prev => prev.map(p => p.uid === uid ? { ...p, status: newStatus } : p));
        } catch (error) { alert(error.message); }
        setLoading(false);
    };

    const handleDelete = async (uid, name) => {
        if (!window.confirm(`Remove ${name} from this event?`)) return;
        setLoading(true);
        try {
            const eventRef = doc(db, "events", eventId);
            await updateDoc(eventRef, { participants: arrayRemove(uid) });
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { [`eventRegistrations.${eventId}`]: null });
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
                        <span className="count-badge">👥 {participants.length} Participants</span>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="aesthetic-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registered Date</th>
                            <th>Status</th>
                            <th className="action-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.length === 0 ? (
                            <tr><td colSpan="5" className="empty-row">No participants yet.</td></tr>
                        ) : (
                            participants.map((p) => {
                                const isExpanded = expandedParticipants[p.uid];
                                return (
                                    <React.Fragment key={p.uid}>
                                        <tr className={`main-row ${isExpanded ? 'active-row' : ''}`}>
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
                                                        onClick={() => updateParticipantStatus(p.uid, "Approved")}
                                                        disabled={p.status === "Approved"}
                                                    >
                                                        Approve
                                                    </button>
                                                    
                                                    <button 
                                                        className="tbl-btn reject-btn" 
                                                        onClick={() => updateParticipantStatus(p.uid, "Rejected")}
                                                        disabled={p.status === "Rejected"}
                                                    >
                                                        Reject
                                                    </button>

                                                    <button 
                                                        className="tbl-btn delete-btn" 
                                                        onClick={() => handleDelete(p.uid, p.name)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* EXPANDED ROW */}
                                        {isExpanded && (
                                            <tr className="detail-row">
                                                <td colSpan="5">
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