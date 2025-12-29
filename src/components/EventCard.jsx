import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

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
  const isLongDesc = event.description && event.description.length > 100;

  // --- Navigation to NGO Profile ---
  const handleViewNGO = () => {
    // Uses 'createdBy' (database field) or 'organizerId' (legacy)
    const ngoId = event.createdBy || event.organizerId; 

    if (ngoId) {
      navigate(`/ngo/${ngoId}`);
    } else {
      console.error("No NGO ID found.");
    }
  };

  return (
    <div className="ep-card">
      
      {/* Top Section */}
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

      {/* Bottom Section */}
      <div className="ep-card-body">
        <h3 className="ep-card-title">{event.title || "Event Title"}</h3>
        
        <p className={`ep-card-desc ${expanded ? 'expanded' : ''}`}>
          {event.description || "No description available."}
        </p>

        <div className="ep-btn-group">
          
          {/* VIEW NGO BUTTON */}
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

          {/* ✅ JOIN BUTTON LOGIC FIXED:
              - Visible if user is NOT 'admin' AND NOT 'NGO'
              - This means Guests (profile is null) and Volunteers WILL see it.
          */}
          {onJoin && profile?.userType !== "admin" && profile?.userType !== "NGO" && (
            <button 
              className={`ep-join-btn ${isAlreadyJoined ? 'joined' : ''}`} 
              onClick={() => {
                // If the user is a guest (not logged in), onJoin will handle the alert/redirect
                if (!isAlreadyJoined) onJoin(event.id);
              }}
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