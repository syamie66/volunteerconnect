import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <section className="section">
      <h2>Volunteer Dashboard</h2>
      <p>Welcome, {profile?.name || 'Volunteer'}!</p>
      <p>Role: {profile?.role}</p>
      <p>Here you can view upcoming events and register for them.</p>
    </section>
  );
}



