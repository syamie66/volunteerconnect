import React, { useEffect, useState } from 'react';
import { listenEvents } from '../services/eventService';
import EventCard from '../components/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = listenEvents(setEvents);
    return () => unsubscribe();
  }, []);

  return (
    <section className="section">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <div className="event-list">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </section>
  );
}
