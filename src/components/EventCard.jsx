// components/EventCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // for redirection

export default function EventCard({ event, onJoin, loading, currentUser, profile }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!currentUser) {
      navigate("/login"); // redirect to login if not logged in
    } else if (profile?.userType === "volunteer") {
      onJoin(event.id); // allow volunteer to join
    }
  };

  return (
    <div className="event-card">
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
      <div className="content">
        <h3>{event.title}</h3>
        <p><strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p>{event.description}</p>
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


