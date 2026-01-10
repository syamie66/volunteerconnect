import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function EventCard({ event, onJoin, currentUser, profile }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [joining, setJoining] = useState(false); 

  // Date Parsing
  const getDateParts = (dateInput) => {
    if (!dateInput) return { day: "00", month: "XXX" };
    const dateObj = (dateInput && typeof dateInput.toDate === 'function') 
      ? dateInput.toDate() 
      : new Date(dateInput);
    if (isNaN(dateObj)) return { day: "00", month: "XXX" };
    return {
      day: dateObj.getDate(),
      month: dateObj.toLocaleString("default", { month: "short" }).toUpperCase()
    };
  };
  const { day, month } = getDateParts(event.date);

  // Time Formatting
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const isAlreadyJoined = event.participants?.includes(currentUser?.uid);
  
  // --- STRICT CAPACITY LOGIC ---
  const maxCountVal = parseInt(event.maxParticipants) || 0;
  
  // STRICT CHECK: We default to 0. 
  // We do NOT use event.participants.length because that includes 'Pending' users.
  // This ensures ONLY 'Approved' users count toward the limit.
  const currentApprovedCount = event.approvedCount || 0;

  // isFull is TRUE only if Approved Count hits the Max
  const isFull = maxCountVal > 0 && currentApprovedCount >= maxCountVal;

  const isLongDesc = event.description && event.description.length > 100;

  const handleViewNGO = () => {
    const ngoId = event.createdBy || event.organizerId; 
    if (ngoId) {
      navigate(`/ngo/${ngoId}`);
    } else {
      console.error("No NGO ID found.");
    }
  };

  // Handle Join
  const handleJoinInternal = async () => {
    if (!currentUser) {
        alert("Please log in to join events.");
        return;
    }
    if (isAlreadyJoined) return;
    
    // Strict block if full
    if (isFull) {
        alert("Sorry, this event is already full.");
        return;
    }

    setJoining(true);

    try {
        const today = new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        // Update User
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            [`eventRegistrations.${event.id}`]: {
                status: "Pending",
                registeredDate: today, 
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date
            }
        });

        // Update Event
        const eventRef = doc(db, "events", event.id);
        await updateDoc(eventRef, {
            participants: arrayUnion(currentUser.uid)
            // NOTE: We do NOT increment approvedCount here. 
            // That happens only when the NGO clicks "Approve" in the dashboard.
        });

        alert("Application submitted successfully!");
        if (onJoin) onJoin(event.id);

    } catch (error) {
        console.error("Error joining event:", error);
        alert("Failed to join. Please try again.");
    } finally {
        setJoining(false);
    }
  };

  // --- BUTTON STATE LOGIC ---
  let joinButtonText = "Join Event";
  let isButtonDisabled = joining || isAlreadyJoined;
  let buttonClass = "ep-join-btn";

  if (joining) {
      joinButtonText = "Applying...";
  } else if (isAlreadyJoined) {
      joinButtonText = "Applied ✓";
      buttonClass += " joined";
  } else if (isFull) {
      // Logic: Only displays "Event Full" if approvedCount >= maxParticipants
      joinButtonText = "Event Full";
      isButtonDisabled = true;
      buttonClass += " full"; 
  }

  return (
    <div className="ep-card">
      
      {/* Top Section */}
      <div className="ep-info-box">
        <div className="ep-date-badge">
          <span className="ep-date-day">{day}</span>
          <span className="ep-date-month">{month}</span>
        </div>

        <div 
          className="ep-org-name" 
          onClick={handleViewNGO}
          style={{ cursor: 'pointer' }}
        >
          {event.organization || "Volunteer Org"}
        </div>

        <div className="ep-details-grid">
            <div className="ep-detail-item">
                <span className="ep-label">Location</span>
                <span className="ep-value">
                  {event.location || "TBD"}{event.city ? `, ${event.city}` : ''}
                </span>
            </div>
            <div className="ep-detail-item">
                <span className="ep-label">Time</span>
                <span className="ep-value">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
            </div>
            <div className="ep-detail-item">
                <span className="ep-label">Registration</span>
                <span className="ep-value" style={{fontSize: '0.75rem'}}>
                    {event.registrationStart ? new Date(event.registrationStart).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Now'} 
                    {' - '} 
                    {event.registrationEnd ? new Date(event.registrationEnd).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'TBD'}
                </span>
            </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="ep-card-body">
        <h3 className="ep-card-title">{event.title || "Event Title"}</h3>
        
        <p className={`ep-card-desc ${expanded ? 'expanded' : ''}`}>
          {event.description || "No description available."}
        </p>

        <div className="ep-btn-group">
          
          <button 
            className="ep-view-profile-btn"
            onClick={handleViewNGO}
            type="button"
          >
            View NGO
          </button>

          {isLongDesc && (
            <button 
                className="ep-read-more-btn"
                onClick={() => setExpanded(!expanded)}
                type="button"
            >
                {expanded ? "Less" : "Info"}
            </button>
          )}

          {/* JOIN BUTTON */}
          {profile?.userType !== "admin" && profile?.userType !== "NGO" && (
            <button 
              className={buttonClass} 
              onClick={handleJoinInternal} 
              disabled={isButtonDisabled}
              style={isFull && !isAlreadyJoined ? { backgroundColor: '#e0e0e0', color: '#888', cursor: 'not-allowed', boxShadow: 'none' } : {}}
            >
              {joinButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}