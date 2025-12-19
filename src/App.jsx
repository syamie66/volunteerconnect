

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
import ProfileUpdate from './pages/ProfileUpdate';

// Admin Pages
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageEvents from './pages/ManageEvents';
import Reports from './pages/Reports';
import AdminRoute from './pages/AdminRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/update" element={<ProfileUpdate />} />

          {/* NGO */}
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:eventId/participants" element={<EventParticipants />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}







