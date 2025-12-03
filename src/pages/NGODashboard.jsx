import React, { useState, useEffect } from 'react';
import { createEvent, listenEvents } from '../services/eventService';
import EventCard from '../components/EventCard';

export default function NGODashboard() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = listenEvents(setEvents);
    return () => unsubscribe();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEvent({ title, date, location, description });
      alert('Event created');
      setTitle(''); setDate(''); setLocation(''); setDescription('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="section">
      <h2>NGO Dashboard</h2>

      <form className="form" onSubmit={handleCreate}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" required />
        <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date" required />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Create Event</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>All Events</h3>
      <div className="event-list">
        {events.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    </section>
  );
}
