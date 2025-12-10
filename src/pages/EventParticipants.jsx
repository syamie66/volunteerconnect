import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './EventParticipants.css';

export default function EventParticipants() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const data = eventSnap.data();
        setEvent(data);

        const participantsData = await Promise.all(
          (data.participants || []).map(async (uid) => {
            const userSnap = await getDoc(doc(db, 'users', uid));
            return userSnap.exists() ? userSnap.data() : { email: 'Unknown' };
          })
        );

        setParticipants(participantsData);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading participants...</p>;
  if (!event) return <p style={{ textAlign: 'center' }}>Event not found.</p>;

  return (
    <div className="participants-container">
      <Link to="/dashboard/ngo">← Back to Dashboard</Link>

      <div className="event-header">
        <h2>{event.title}</h2>
        <p>
          <strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time} |{' '}
          <strong>Location:</strong> {event.location}
        </p>
        <p><strong>Organization:</strong> {event.ngoName}</p>
      </div>

      <h3>Participants ({participants.length})</h3>
      <ul>
        {participants.length === 0 ? (
          <li>No participants yet</li>
        ) : (
          participants.map((p, idx) => <li key={idx}>{p.name || p.email}</li>)
        )}
      </ul>
    </div>
  );
}


