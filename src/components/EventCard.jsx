import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!currentUser) {
      navigate("/login"); // redirect if not logged in
    } else if (profile?.userType === "volunteer") {
      onJoin(event.id); // join event
    }
  };

  return (
    <div className="event-card">
      <div className="content">
        <h3>{event.title}</h3>
        <p><strong>Organization:</strong> {event.organization}</p>
        <p><span role="img" aria-label="calendar">📅</span> {event.date} | <span role="img" aria-label="clock">⏰</span> {event.time}</p>
        <p><span role="img" aria-label="location">📍</span> {event.location}</p>
        <p><strong>Registration:</strong> {event.registrationStart} to {event.registrationEnd}</p>
        <p className="description">
          {event.description.length > 100
            ? event.description.slice(0, 100) + "..."
            : event.description}
        </p>
        <div className="card-footer">
          <span>Participants: {event.participants?.length || 0}</span>
          <button onClick={handleClick} disabled={loading}>
            {loading ? "Joining..." : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}




