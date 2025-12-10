import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';
import './NGODashboard.css';

export default function NGODashboard() {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [participantsMap, setParticipantsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !profile) return;

    const q = collection(db, 'events');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const eventsData = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.createdBy === currentUser.uid); // only NGO's events
      setEvents(eventsData);

      const tempMap = {};
      for (const event of eventsData) {
        if (event.participants?.length > 0) {
          const usersData = await Promise.all(
            event.participants.map(async (uid) => {
              const docSnap = await getDoc(doc(db, 'users', uid));
              return docSnap.exists() ? docSnap.data() : { email: 'Unknown' };
            })
          );
          tempMap[event.id] = usersData;
        } else {
          tempMap[event.id] = [];
        }
      }
      setParticipantsMap(tempMap);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, profile]);

  if (!currentUser) return <p>Loading user...</p>;
  if (!profile) return <p>Loading profile...</p>;
  if (profile.userType !== 'NGO') return <p>Access denied. Only NGOs can view this page.</p>;
  if (loading) return <p>Loading events...</p>;

  const handleViewParticipants = (eventId) => {
    navigate(`/event/${eventId}/participants`);
  };

  return (
    <section className="ngo-dashboard-container">
      <h2>NGO Dashboard</h2>

      {events.length === 0 && <p>No events created yet.</p>}

      <div className="event-list">
        {events.map(ev => (
          <div key={ev.id} className="event-item">
            <EventCard event={ev} />

            <button
              className="toggle-participants"
              onClick={() => handleViewParticipants(ev.id)}
            >
              View Participants ({participantsMap[ev.id]?.length || 0})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}




