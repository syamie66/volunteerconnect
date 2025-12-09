// pages/CreateEvent.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import EventForm from "../components/EventForm";

export default function CreateEvent() {
  const { currentUser, profile } = useAuth();

  // Only allow NGOs to access this page
  if (!currentUser || profile?.userType !== "NGO") {
    return <p>You must be logged in as an NGO to create events.</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Create New Event</h1>
      <EventForm currentUser={currentUser} profile={profile} />
    </div>
  );
}
