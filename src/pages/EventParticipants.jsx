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

    // -----------------------------------------------------
    // LOAD EVENT + PARTICIPANTS INFORMATION
    // -----------------------------------------------------
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

                        // Pull event-specific registration fields
                        const reg = user.eventRegistrations?.[eventId] || {};

                        return {
                            uid,

                            // User profile fields
                            name: user.name || "Unknown",
                            email: user.email || "N/A",
                            phone: user.phone || "N/A",
                            icNumber: user.icNumber || "N/A",
                            address: user.address || "N/A",
                            emergencyContact: user.emergencyContact || "N/A",
                            gender: user.gender || "N/A",
                            skills: user.skills || "N/A",

                            // Registration fields
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


    // -----------------------------------------------------
    // EXPAND / COLLAPSE
    // -----------------------------------------------------
    const toggleDetails = (uid) => {
        setExpandedParticipants((prev) => ({
            ...prev,
            [uid]: !prev[uid],
        }));
    };


    // -----------------------------------------------------
    // UPDATE STATUS (Approve/Reject)
    // -----------------------------------------------------
    const updateParticipantStatus = async (uid, newStatus) => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', uid);

            await updateDoc(userRef, {
                [`eventRegistrations.${eventId}.status`]: newStatus,
            });

            setParticipants(prev =>
                prev.map(p =>
                    p.uid === uid ? { ...p, status: newStatus } : p
                )
            );
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
        setLoading(false);
    };

    const handleApprove = (uid) => updateParticipantStatus(uid, "Approved");
    const handleReject = (uid) => updateParticipantStatus(uid, "Rejected");


    // -----------------------------------------------------
    // DELETE PARTICIPANT FROM EVENT
    // -----------------------------------------------------
    const handleDelete = async (uid, name) => {
        if (!window.confirm(`Remove ${name} from this event?`)) return;

        setLoading(true);
        try {
            const eventRef = doc(db, "events", eventId);

            await updateDoc(eventRef, {
                participants: arrayRemove(uid)
            });

            const userRef = doc(db, "users", uid);

            await updateDoc(userRef, {
                [`eventRegistrations.${eventId}`]: null
            });

            setParticipants(prev => prev.filter(p => p.uid !== uid));

        } catch (error) {
            alert("Failed to delete participant: " + error.message);
        }

        setLoading(false);
    };


    // -----------------------------------------------------
    // RENDER UI
    // -----------------------------------------------------
    if (loading) return <p style={{ textAlign: "center" }}>Loading participants...</p>;
    if (!event) return <p style={{ textAlign: "center" }}>Event not found.</p>;

    return (
        <div className="participants-container">
            <Link to="/dashboard/ngo" className="back-link">← Back to Dashboard</Link>

            <div className="event-header">
                <h2>{event.title}</h2>
                <p>
                    <strong>Date:</strong> {event.date} |{" "}
                    <strong>Time:</strong> {event.time} |{" "}
                    <strong>Location:</strong> {event.location}
                </p>
                <p><strong>Organization:</strong> {event.ngoName}</p>
            </div>

            <h3 style={{ marginTop: "2rem" }}>
                Participants ({participants.length})
            </h3>

            {participants.length === 0 ? (
                <p>No participants yet.</p>
            ) : (
                <div className="participant-list">
                    {participants.map((p) => {
                        const isExpanded = expandedParticipants[p.uid] || false;

                        let statusStyle = { fontWeight: 600 };
                        if (p.status === "Pending") statusStyle.color = "orange";
                        if (p.status === "Approved") statusStyle.color = "green";
                        if (p.status === "Rejected") statusStyle.color = "red";

                        return (
                            <div key={p.uid} className="participant-card">

                                <div className="participant-content-wrapper">
                                    <div className="participant-info">
                                        <h4>{p.name}</h4>
                                        <p><strong>Email:</strong> {p.email}</p>

                                        {isExpanded && (
                                            <>
                                                <p><strong>Phone:</strong> {p.phone}</p>
                                                <p><strong>IC:</strong> {p.icNumber}</p>
                                                <p><strong>Gender:</strong> {p.gender}</p>
                                                <p><strong>Address:</strong> {p.address}</p>
                                                <p><strong>Emergency Contact:</strong> {p.emergencyContact}</p>
                                                <p><strong>Skills:</strong> {p.skills}</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="participant-details">
                                        <p style={statusStyle}>Status: {p.status}</p>
                                        <p>Registered: {p.registeredDate}</p>
                                    </div>
                                </div>

                                <div className="participant-actions">
                                    <button
                                        className="view-btn"
                                        onClick={() => toggleDetails(p.uid)}
                                    >
                                        {isExpanded ? "Hide Details" : "View Full Details"}
                                    </button>

                                    {(isExpanded || p.status === "Pending") && (
                                        <>
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleApprove(p.uid)}
                                                disabled={p.status === "Approved"}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="reject-btn"
                                                onClick={() => handleReject(p.uid)}
                                                disabled={p.status === "Rejected"}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(p.uid, p.name)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}




