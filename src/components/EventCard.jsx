import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function EventCard({ event, onJoin, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [joining, setJoining] = useState(false); 

  // --- HELPER: Safe Date Parsing ---
  const parseDate = (dateInput) => {
    if (!dateInput) return null;
    if (typeof dateInput.toDate === 'function') {
      return dateInput.toDate();
    }
    return new Date(dateInput);
  };

  // --- EVENT DATE DISPLAY ---
  const getDisplayDate = (dateInput) => {
    const dateObj = parseDate(dateInput);
    if (!dateObj || isNaN(dateObj)) return { day: "00", month: "XXX" };
    return {
      day: dateObj.getDate(),
      month: dateObj.toLocaleString("default", { month: "short" }).toUpperCase()
    };
  };
  const { day, month } = getDisplayDate(event.date);

  // --- TIME FORMATTING ---
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  // --- REGISTRATION WINDOW CHECK ---
  const now = new Date();
  const regStart = parseDate(event.registrationStart);
  const regEnd = parseDate(event.registrationEnd);

  const isBeforeReg = regStart && now < regStart;
  const isAfterReg = regEnd && now > regEnd;

  // --- CAPACITY CHECKS ---
  const isAlreadyJoined = event.participants?.includes(currentUser?.uid);
  const maxCountVal = parseInt(event.maxParticipants) || 0;
  const currentApprovedCount = event.approvedCount || 0;
  const isFull = maxCountVal > 0 && currentApprovedCount >= maxCountVal;

  const isLongDesc = event.description && event.description.length > 100;

  const handleViewNGO = () => {
    const ngoId = event.createdBy || event.organizerId; 
    if (ngoId) navigate(`/ngo/${ngoId}`);
  };

  // --- JOIN HANDLER ---
  const handleJoinInternal = async () => {
    if (!currentUser) return alert("Please log in to join events.");

    // --- STRICT CHECK: DISABLED USER ---
    if (profile?.disabled) {
        alert("Action Denied: Your account is currently disabled by the administrator. You cannot apply for events.");
        return; 
    }

    if (isAlreadyJoined) return;
    
    // Strict block based on Registration Window
    if (isBeforeReg) return alert("Registration has not started yet.");
    if (isAfterReg) return alert("Registration has closed.");
    if (isFull) return alert("Sorry, this event is already full.");

    setJoining(true);

    try {
        const todayStr = new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            [`eventRegistrations.${event.id}`]: {
                status: "Pending",
                registeredDate: todayStr, 
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date
            }
        });

        const eventRef = doc(db, "events", event.id);
        await updateDoc(eventRef, {
            participants: arrayUnion(currentUser.uid)
        });

        alert("Application submitted successfully!");
        if (onJoin) onJoin(event.id);

    } catch (error) {
        console.error("Error joining event:", error);
        alert("Failed to join. Please try again.");
    } finally {
        setJoining(false);
    }
  };

  // --- BUTTON STATE LOGIC ---
  let joinButtonText = "Join Event";
  let isButtonDisabled = joining || isAlreadyJoined;
  let buttonClass = "ep-join-btn";

  if (joining) {
      joinButtonText = "Applying...";
  } 
  else if (isAlreadyJoined) {
      joinButtonText = "Applied ✓";
      buttonClass += " joined";
  } 
  else if (isBeforeReg) {
      const startStr = regStart.toLocaleDateString(undefined, {month:'short', day:'numeric'});
      joinButtonText = `Opens ${startStr}`;
      isButtonDisabled = true;
      buttonClass += " disabled";
  } 
  else if (isAfterReg) {
      joinButtonText = "Registration Closed";
      isButtonDisabled = true;
      buttonClass += " disabled";
  } 
  else if (isFull) {
      joinButtonText = "Event Full";
      isButtonDisabled = true;
      buttonClass += " full";
  }

  const disabledStyle = { 
    backgroundColor: '#e0e0e0', 
    color: '#888', 
    cursor: 'not-allowed', 
    boxShadow: 'none',
    border: '1px solid #ccc'
  };

  return (
    <div className="ep-card">
      <div className="ep-info-box">
        <div className="ep-date-badge">
          <span className="ep-date-day">{day}</span>
          <span className="ep-date-month">{month}</span>
        </div>

        <div 
          className="ep-org-name" 
          onClick={handleViewNGO}
          style={{ cursor: 'pointer' }}
        >
          {event.organization || "Volunteer Org"}
        </div>

        <div className="ep-details-grid">
            <div className="ep-detail-item">
                <span className="ep-label">Location</span>
                <span className="ep-value">
                  {event.location || "TBD"}{event.city ? `, ${event.city}` : ''}
                </span>
            </div>
            <div className="ep-detail-item">
                <span className="ep-label">Time</span>
                <span className="ep-value">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
            </div>
            <div className="ep-detail-item">
                <span className="ep-label">Registration</span>
                <span className="ep-value" style={{fontSize: '0.75rem'}}>
                    {regStart ? regStart.toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Now'} 
                    {' - '} 
                    {regEnd ? regEnd.toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'TBD'}
                </span>
            </div>
        </div>
      </div>

      <div className="ep-card-body">
        <h3 className="ep-card-title">{event.title || "Event Title"}</h3>
        
        <p className={`ep-card-desc ${expanded ? 'expanded' : ''}`}>
          {event.description || "No description available."}
        </p>

        <div className="ep-btn-group">
          <button 
            className="ep-view-profile-btn"
            onClick={handleViewNGO}
            type="button"
          >
            View NGO
          </button>

          {isLongDesc && (
            <button 
                className="ep-read-more-btn"
                onClick={() => setExpanded(!expanded)}
                type="button"
            >
                {expanded ? "Less" : "Info"}
            </button>
          )}

          {/* JOIN BUTTON */}
          {profile?.userType !== "admin" && profile?.userType !== "NGO" && (
            <button 
              className={buttonClass} 
              onClick={handleJoinInternal} 
              disabled={isButtonDisabled}
              style={isButtonDisabled && !isAlreadyJoined ? disabledStyle : {}}
            >
              {joinButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}