import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { 
  Calendar, Trash2, Eye, MapPin, Clock, 
  Users, X, AlignLeft, Building2 
} from "lucide-react";
import './AdminCSS.css';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 1. Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };
    fetchEvents();
  }, []);

  // 2. Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  // 3. Search / Filter Logic
  const filteredEvents = events.filter(event => {
    const term = searchTerm.toLowerCase();
    const title = event.title?.toLowerCase() || '';
    const ngo = event.ngoName?.toLowerCase() || event.organization?.toLowerCase() || '';
    const loc = event.location?.toLowerCase() || '';
    
    return title.includes(term) || ngo.includes(term) || loc.includes(term);
  });

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    // WRAPPER CLASS FOR SCOPED CSS
    <div className="admin-dashboard-scope">
      <div className="content-container">
        
        {/* --- PAGE TITLE --- */}
        <h1 className="page-title">Manage Events</h1>

        {/* --- TABLE CARD --- */}
        <div className="card table-card">
          <div className="card-header">
            <h3>All Active Events</h3>
            
            {/* Search Input */}
            <div className="search-bar" style={{ width: '250px', border: '1px solid #eee' }}>
              <input 
                type="text" 
                placeholder="Search event, NGO, or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Organization</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr key={event.id}>
                      {/* Event Name */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="profile-pic pink-theme" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>
                            <Calendar size={18} />
                          </div>
                          <span style={{ fontWeight: '600' }}>{event.title}</span>
                        </div>
                      </td>
                      
                      {/* Organization */}
                      <td>{event.ngoName || event.organization || "Unknown NGO"}</td>
                      
                      {/* Date */}
                      <td>
                        <div style={{ fontSize: '0.9rem' }}>{formatDate(event.date)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>
                          {event.startTime ? `${event.startTime} - ${event.endTime}` : 'Time TBD'}
                        </div>
                      </td>

                      {/* Location */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                           <MapPin size={14} /> 
                           {event.location?.substring(0, 20)}{event.location?.length > 20 ? '...' : ''}
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="btn-icon btn-view"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="btn-icon"
                            style={{ backgroundColor: '#fee2e2', color: '#ef4444' }} // Light red bg, red icon
                            title="Delete Event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                      No events found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- DETAILS MODAL --- */}
        {selectedEvent && (
          <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="modal-header">
                <h2>
                  <Calendar size={24}/>
                  {selectedEvent.title}
                </h2>
                <button className="btn-close" onClick={() => setSelectedEvent(null)}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="detail-grid">
                  
                  {/* Row 1: Org & Location */}
                  <div className="detail-item">
                    <label>Organization</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={16} className="text-gray-400"/>
                      {selectedEvent.ngoName || selectedEvent.organization || "N/A"}
                    </p>
                  </div>

                  <div className="detail-item">
                    <label>Location</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} className="text-gray-400"/>
                      {selectedEvent.location || "N/A"}
                    </p>
                  </div>

                  {/* Row 2: Date & Time */}
                  <div className="detail-item">
                    <label>Date</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} className="text-gray-400"/>
                      {formatDate(selectedEvent.date)}
                    </p>
                  </div>

                  <div className="detail-item">
                    <label>Time</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} className="text-gray-400"/>
                      {selectedEvent.startTime || "--"} - {selectedEvent.endTime || "--"}
                    </p>
                  </div>

                  {/* Row 3: Participants (Using Status Tag Style) */}
                  <div className="detail-item span-full">
                    <label>Participation</label>
                    <div style={{ marginTop: '5px' }}>
                      <span className="status-tag warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                        <Users size={14}/> 
                        {selectedEvent.participants ? selectedEvent.participants.length : 0} 
                        <span style={{ opacity: 0.6 }}>/ {selectedEvent.maxParticipants || '∞'} Volunteers Joined</span>
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Description */}
                  <div className="detail-item span-full">
                    <label>Event Description</label>
                    <div className="desc-box">
                      {selectedEvent.description || "No description provided."}
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button 
                  className="btn-secondary" 
                  onClick={() => setSelectedEvent(null)}
                  style={{ marginRight: '10px' }}
                >
                  Close
                </button>
                <button 
                  className="btn-toggle is-disabled"
                  onClick={() => {
                    handleDelete(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                >
                  Delete Event
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}