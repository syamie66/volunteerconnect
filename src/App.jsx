import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NGODashboard from './pages/NGODashboard';
import CreateEvent from './pages/CreateEvent';
import EventParticipants from './pages/EventParticipants';
import ProfileUpdate from './pages/ProfileUpdate'; // <-- 1. Import the new component

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
            {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/update" element={<ProfileUpdate />} /> {/* <-- 2. Define the new route */}

            {/* NGO Management Routes */}
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:eventId/participants" element={<EventParticipants />} />
            
        </Routes>
      </main>
    </>
  );
}





