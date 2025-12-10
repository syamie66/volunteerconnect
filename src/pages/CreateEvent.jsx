// pages/CreateEvent.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import EventForm from "../components/EventForm";

export default function CreateEvent() {
  const { currentUser, profile } = useAuth();

  // auth state still loading
  if (!currentUser) return <p>Loading user...</p>;
  if (!profile) return <p>Loading profile...</p>;

  // Only allow NGOs
  if (profile.userType !== "NGO") {
    return <p>You must be logged in as an NGO to create events.</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Create New Event</h1>
      <EventForm currentUser={currentUser} profile={profile} />
    </div>
  );
}

