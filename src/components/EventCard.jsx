import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!currentUser) {
      navigate("/login");
    } else if (profile?.userType === "volunteer") {
        onJoin(event.id);
    }
  };

  const isLong = event.description?.length > 100;
  const descriptionText =
    expanded || !isLong
      ? event.description
      : event.description.slice(0, 100) + "...";

  return (
    <div className="event-card">
      <div className="content">
        <h3>{event.title}</h3>

        <p><strong>Organization:</strong> {event.organization}</p>
        <p>📅 {event.date} | ⏰ {event.time}</p>
        <p>📍 {event.location}</p>

        {/* Registration dates displayed separately */}
        <p>
          <strong>Registration Opens:</strong> {event.registrationStart}
        </p>
        <p>
          <strong>Registration Closes:</strong> {event.registrationEnd}
        </p>

        <p className="description">
          {descriptionText}
          {isLong && (
            <span
              className="read-more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? " Read less" : " Read more"}
            </span>
          )}
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

