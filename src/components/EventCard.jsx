// components/EventCard.jsx
import React from "react";

export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p>{event.description}</p>
      <p><strong>Participants:</strong> {event.participants?.length || 0}</p>
    </div>
  );
}

