import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
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
        .filter(e => e.createdBy === currentUser.uid);

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
  if (profile.userType !== 'NGO') return <p>Access denied.</p>;
  if (loading) return <p>Loading events...</p>;

  const handleViewParticipants = (eventId) => {
    navigate(`/event/${eventId}/participants`);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/event/${eventId}/edit`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteDoc(doc(db, 'events', eventId));
    }
  };

  return (
    <section className="ngo-dashboard-container">
      <h2>NGO Dashboard</h2>

      {events.length === 0 && <p>No events created yet.</p>}

      <div className="event-grid-ngo">
        {events.map(ev => (
          <div key={ev.id} className="event-card-ngo">

            <div className="event-body-ngo">
              <h3 className="event-title-ngo">{ev.title}</h3>

              <p><strong>🏢 Organization:</strong> {ev.organization}</p>
              <p><strong>📅 Date:</strong> {ev.date}</p>
              <p><strong>⏰ Time:</strong> {ev.time}</p>
              <p><strong>📍 Location:</strong> {ev.location}</p>

              <p className="event-desc-ngo">{ev.description}</p>
            </div>

            <div className="event-footer-ngo">
              <button
                className="view-btn-ngo"
                onClick={() => handleViewParticipants(ev.id)}
              >
                👥 Participants ({participantsMap[ev.id]?.length || 0})
              </button>

              <div className="event-admin-actions-ngo">
                <button
                  className="edit-btn-ngo"
                  onClick={() => handleEditEvent(ev.id)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="delete-btn-ngo"
                  onClick={() => handleDeleteEvent(ev.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}





