import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // --- Date Parsing Helper ---
  const getDateParts = (dateInput) => {
    let dateObj;
    if (dateInput && typeof dateInput.toDate === 'function') {
      dateObj = dateInput.toDate();
    } else if (dateInput) {
      dateObj = new Date(dateInput);
    } else {
      return { day: "00", month: "???", weekday: "" };
    }
    if (isNaN(dateObj)) return { day: "??", month: "???", weekday: "" };
    return {
      day: dateObj.getDate(),
      month: dateObj.toLocaleString("default", { month: "short" }),
      weekday: dateObj.toLocaleString("default", { weekday: "long" }),
    };
  };

  const { day, month, weekday } = getDateParts(event.date);

  // --- Handlers ---
  
  // 1. Join Button (Protected)
  const handleClick = () => {
    if (!currentUser) {
      navigate("/login");
    } else if (profile?.userType === "volunteer") {
      onJoin(event.id);
    }
  };

  // 2. Visit Org Button (PUBLIC)
  const handleVisitOrg = (e) => {
    e.stopPropagation(); // Stop the card click event

    // Get the Organizer ID
    const targetId = event.organizerId || event.uid || event.createdBy || event.userId;

    if (targetId) {
      // ✅ FIX: Navigate to the PUBLIC route pattern defined in App.jsx
      navigate(`/ngo/${targetId}`); 
    } else {
      console.error("ERROR: No Organizer ID found in this event object.", event);
      alert("Error: Cannot find the organization's ID.");
    }
  };

  const isLong = event.description?.length > 100;
  const descriptionText = expanded || !isLong
      ? event.description
      : event.description.slice(0, 100) + "...";

  return (
    <div className="event-card-horizontal">
      {/* LEFT SIDE: DATE BOX */}
      <div className="event-date-box">
        <span className="event-date-day">{day}</span>
        <span className="event-date-weekday">{weekday}</span>
        <span className="event-date-month">{month}</span>
      </div>

      {/* RIGHT SIDE: DETAILS */}
      <div className="event-details">
        <h3 className="event-name">{event.title}</h3>
        
        {/* ORGANIZATION ROW + BUTTON */}
        <div className="event-org-row">
          <p className="event-org">
            <span className="pink-accent">By:</span> {event.organization}
          </p>
          <button className="ngo-visit-btn" onClick={handleVisitOrg}>
            Get to know us!
          </button>
        </div>

        {/* Icons & Meta Data */}
        <div className="event-meta">
          <span className="event-meta-item">⏰ {event.time}</span>
          <span className="event-meta-item">📍 {event.location}</span>
        </div>

        {/* Registration Dates */}
        <div className="event-reg-dates">
           Registration: {event.registrationStart} — {event.registrationEnd}
        </div>

        {/* Description */}
        <p className="event-description-text">
          {descriptionText}
          {isLong && (
            <span className="read-more" onClick={() => setExpanded(!expanded)}>
              {expanded ? " Read less" : " Read more"}
            </span>
          )}
        </p>

        {/* Footer */}
        <div className="card-footer-styled">
          <span className="participant-count">
            <i className="pink-icon">♥</i> {event.participants?.length || 0} Volunteers
          </span>
          <button className="join-btn" onClick={handleClick} disabled={loading}>
            {loading ? "Joining..." : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}