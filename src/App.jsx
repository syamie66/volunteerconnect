import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/ngo/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import NGORegister from './pages/ngo/NGORegister';
import Dashboard from './pages/volunteer/Dashboard';
import NGODashboard from './pages/ngo/NGODashboard';
import CreateEvent from './pages/ngo/CreateEvent';
import EditEvent from './pages/ngo/EditEvent'; 
import EventParticipants from './pages/ngo/EventParticipants';
import ProfileUpdate from './pages/volunteer/ProfileUpdate';
import NGOProfile from './pages/ngo/NGOProfile'; 
import EditNGOProfile from './pages/ngo/EditNGOProfile';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageEvents from './pages/admin/ManageEvents';
import Reports from './pages/Reports';
import AdminRoute from './pages/admin/AdminRoute';

export default function App() {
  const location = useLocation();
  
  // Helper to check if current path matches dynamic patterns
  const isDynamicRoute = (path) => {
    if (location.pathname.startsWith(path)) return true;
    return false;
  };

  const isFullWidthPage = 
    location.pathname === '/' || 
    location.pathname === '/events' || 
    location.pathname === '/register' || 
    location.pathname === '/ngo-register' ||
    location.pathname === '/login' ||
    location.pathname === '/dashboard' || 
    location.pathname === '/dashboard/ngo' || 
    location.pathname === '/ngo-profile' || 
    location.pathname === '/edit-ngo-profile' || 
    location.pathname === '/profile/update' || 
    isDynamicRoute('/ngo/') ||       // Covers /ngo/123
    isDynamicRoute('/event/') ||     // Covers /event/123/edit
    location.pathname.includes('/participants'); 

  return (
    <>
      <Navbar /> 

      <main className={isFullWidthPage ? '' : 'main-content'}>
        <Routes>
          {/* --- Public Routes (Accessible by Guests) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo-register" element={<NGORegister />} />
          
          {/* ✅ PUBLIC PROFILE ROUTE: This allows /ngo/123 to work for guests */}
          <Route path="/ngo/:id" element={<NGOProfile />} />

          {/* --- Volunteer/User Dashboard --- */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/update" element={<ProfileUpdate />} />

          {/* --- NGO Dashboard & Private Pages --- */}
          <Route path="/dashboard/ngo" element={<NGODashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id/edit" element={<EditEvent />} /> 
          
          {/* Private view (Logged in NGO viewing their own profile) */}
          <Route path="/ngo-profile" element={<NGOProfile />} />
          
          {/* Edit Profile Page */}
          <Route path="/edit-ngo-profile" element={<EditNGOProfile />} />

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