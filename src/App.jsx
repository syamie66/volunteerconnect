import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Component Imports
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
import NGOProfile from './pages/NGOProfile'; 

// Admin Pages
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageEvents from './pages/ManageEvents';
import Reports from './pages/Reports';
import AdminRoute from './pages/AdminRoute';

export default function App() {
  const location = useLocation();
  
  const isFullWidthPage = 
    location.pathname === '/' || 
    location.pathname === '/events' || 
    location.pathname === '/register' || 
    location.pathname === '/ngo-register' ||
    location.pathname === '/login' ||
    location.pathname === '/dashboard' || 
    location.pathname === '/dashboard/ngo' ||  // <--- ADDED: To support your new dashboard layout
    location.pathname === '/ngo-profile' ||    // <--- ADDED: To support the profile page
    location.pathname === '/profile/update' || 
    location.pathname.startsWith('/ngo/') ||
    location.pathname.includes('/participants'); 

  return (
    <>
      <Navbar /> 

      <main className={isFullWidthPage ? '' : 'main-content'}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo-register" element={<NGORegister />} />
          
          {/* Public view of an NGO (requires ID) */}
          <Route path="/ngo/:id" element={<NGOProfile />} />

          {/* --- Volunteer/User Dashboard --- */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/update" element={<ProfileUpdate />} />

          {/* --- NGO Dashboard & Private Pages --- */}
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id/edit" element={<EditEvent />} /> 
          
          {/* Private view for the logged-in NGO (No ID needed) */}
          {/* 👇 THIS IS THE MISSING ROUTE 👇 */}
          <Route path="/ngo-profile" element={<NGOProfile />} />

          <Route path="/event/:eventId/participants" element={<EventParticipants />} />

          {/* --- Admin Routes --- */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
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