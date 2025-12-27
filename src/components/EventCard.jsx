import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); // Controls Read More state

  // --- Date Parsing ---
  const getDateParts = (dateInput) => {
    if (!dateInput) return { day: "00", month: "XXX" };
    const dateObj = (dateInput && typeof dateInput.toDate === 'function') 
      ? dateInput.toDate() 
      : new Date(dateInput);
    if (isNaN(dateObj)) return { day: "00", month: "XXX" };
    return {
      day: dateObj.getDate(),
      month: dateObj.toLocaleString("default", { month: "short" }).toUpperCase()
    };
  };
  const { day, month } = getDateParts(event.date);

  // --- Time Formatting ---
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const isAlreadyJoined = event.participants?.includes(currentUser?.uid);
  const currentCount = event.participants?.length || 0;
  const maxCount = event.maxParticipants || "-";
  
  // Logic: Only show "Read More" if text is longer than 100 characters
  const isLongDesc = event.description && event.description.length > 100;

  return (
    <div className="ep-card">
      
      {/* --- TOP SECTION: DETAILS BOX (Pink) --- */}
      <div className="ep-info-box">
        <div className="ep-date-badge">
          <span className="ep-date-day">{day}</span>
          <span className="ep-date-month">{month}</span>
        </div>

        <div 
            className="ep-org-name" 
            onClick={() => event.organizerId && navigate(`/ngo/${event.organizerId}`)}
            style={{cursor: event.organizerId ? 'pointer' : 'default'}}
        >
          {event.organization || "Volunteer Org"}
        </div>

        <div className="ep-details-grid">
            <div className="ep-detail-item">
                <span className="ep-label">Location</span>
                {/* UPDATE: Added City check here */}
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
                    {event.registrationStart ? new Date(event.registrationStart).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Now'} 
                    {' - '} 
                    {event.registrationEnd ? new Date(event.registrationEnd).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'TBD'}
                </span>
            </div>
            <div className="ep-detail-item">
                <span className="ep-label">Capacity</span>
                <span className="ep-value">{currentCount} / {maxCount}</span>
            </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: TITLE, DESC & BUTTONS --- */}
      <div className="ep-card-body">
        <h3 className="ep-card-title">{event.title || "Event Title"}</h3>
        
        {/* Description: Toggles 'expanded' class based on state */}
        <p className={`ep-card-desc ${expanded ? 'expanded' : ''}`}>
          {event.description || "No description available."}
        </p>

        <div className="ep-btn-group">
          
          {/* BUTTON 1: READ MORE */}
          {isLongDesc && (
            <button 
                className="ep-read-more-btn"
                onClick={() => setExpanded(!expanded)}
                type="button"
            >
                {expanded ? "Show Less" : "Read More"}
            </button>
          )}

          {/* BUTTON 2: JOIN (Volunteers Only) */}
          {profile?.userType !== "NGO" && onJoin && (
            <button 
              className={`ep-join-btn ${isAlreadyJoined ? 'joined' : ''}`} 
              onClick={() => !isAlreadyJoined && onJoin(event.id)} 
              disabled={loading || isAlreadyJoined}
            >
              {loading ? "..." : isAlreadyJoined ? "Applied ✓" : "Join Event"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}