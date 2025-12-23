// pages/CreateEvent.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import EventForm from "../../components/EventForm";

export default function CreateEvent() {
  const { currentUser, profile } = useAuth();

  if (!currentUser) return <p>Loading user...</p>;
  if (!profile) return <p>Loading profile...</p>;

  if (profile.userType !== "NGO") {
    return <p>You must be logged in as an NGO to create events.</p>;
  }

  // REMOVED: maxWidth, margin, and padding to let EventForm handle the full layout
  return (
    <div>
      <EventForm currentUser={currentUser} profile={profile} />
    </div>
  );
}

