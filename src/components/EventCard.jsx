import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // --- 1. Date Parsing for the Big Left Box ---
  const getDateParts = (dateInput) => {
    let dateObj;
    if (dateInput && typeof dateInput.toDate === 'function') {
      dateObj = dateInput.toDate(); // Firestore Timestamp
    } else if (dateInput) {
      dateObj = new Date(dateInput); // String
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

  // --- 2. Format Time Helper (24h -> 12h with a.m./p.m.) ---
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour, 10);
    const m = minute;
    const ampm = h >= 12 ? "p.m." : "a.m.";
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    return `${h}.${m} ${ampm}`;
  };

  // --- 3. Format Date Helper (YYYY-MM-DD -> DD Mon (Day)) ---
  const formatDateWithDay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      weekday: 'short' 
    }); 
    // Example output: "12 Oct (Mon)"
  };

  // --- Handlers ---
  const handleClick = () => {
    if (!currentUser) {
      navigate("/login");
    } else if (profile?.userType === "volunteer") {
      onJoin(event.id);
    }
  };

  const handleVisitOrg = (e) => {
    e.stopPropagation();
    const targetId = event.organizerId || event.uid || event.createdBy;
    if (targetId) navigate(`/ngo/${targetId}`);
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
        
        <div className="event-org-row">
          <p className="event-org">
            <span className="pink-accent">By:</span> {event.organization}
          </p>
          <button className="ngo-visit-btn" onClick={handleVisitOrg}>
            Get to know us!
          </button>
        </div>

        {/* --- UPDATED META SECTION --- */}
        <div className="event-meta-grid">
          
          {/* Location */}
          <div className="meta-row">
            <span className="meta-icon">📍</span> 
            <span className="meta-text">{event.location}</span>
          </div>

          {/* Time Split */}
          <div className="meta-row">
            <span className="meta-icon">⏰</span>
            <div className="meta-column">
                <span>Start Time: {formatTime(event.startTime)}</span>
                <span>End Time: &nbsp; {formatTime(event.endTime)}</span>
            </div>
          </div>

          {/* Registration Split */}
          <div className="meta-row">
            <span className="meta-icon">📝</span>
            <div className="meta-column">
                <span>Registration Open: {formatDateWithDay(event.registrationStart)}</span>
                <span>Reg Close: {formatDateWithDay(event.registrationEnd)}</span>
            </div>
          </div>

        </div>

        <p className="event-description-text">
          {descriptionText}
          {isLong && (
            <span className="read-more" onClick={() => setExpanded(!expanded)}>
              {expanded ? " Read less" : " Read more"}
            </span>
          )}
        </p>

        <div className="card-footer-styled">
          <span className="participant-count">
            <i className="pink-icon">♥</i> {event.participants?.length || 0} / {event.maxParticipants || '?'} Volunteers
          </span>
          
          {profile?.userType !== "NGO" && (
            <button className="join-btn" onClick={handleClick} disabled={loading}>
              {loading ? "Joining..." : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}