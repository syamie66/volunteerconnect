import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import NGORegister from './pages/NGORegister';
import Dashboard from './pages/Dashboard';
import NGODashboard from './pages/NGODashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent'; 
import EventParticipants from './pages/EventParticipants';
import ProfileUpdate from './pages/ProfileUpdate';
import NGOProfile from './pages/NGOProfile'; // <--- 1. IMPORT THIS

// Admin Pages
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageEvents from './pages/ManageEvents';
import Reports from './pages/Reports';
import AdminRoute from './pages/AdminRoute';

export default function App() {
  const location = useLocation();
  
  // Added '/ngo/' to full width pages so the profile looks good
  const isFullWidthPage = 
    location.pathname === '/' || 
    location.pathname === '/events' || 
    location.pathname === '/register' || 
    location.pathname === '/ngo-register' ||
    location.pathname.startsWith('/ngo/'); // <--- 2. CHECK FOR NGO PROFILE PATH

  return (
    <>
      <Navbar /> 

      <main className={isFullWidthPage ? '' : 'main-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo-register" element={<NGORegister />} />
          
          {/* 3. NEW PUBLIC PROFILE ROUTE */}
          {/* This allows anyone to visit /ngo/12345 */}
          <Route path="/ngo/:id" element={<NGOProfile />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/update" element={<ProfileUpdate />} />

          {/* NGO */}
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id/edit" element={<EditEvent />} /> 
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