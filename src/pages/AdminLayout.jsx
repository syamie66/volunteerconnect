import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Users, Calendar, Flag } from "lucide-react";
import './AdminCSS.css';

export default function AdminLayout() {
  return (
    <div className="admin-container">
      {/* Top Navigation Menu */}
      <div className="admin-top-nav">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? "top-nav-item active" : "top-nav-item"}>
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "top-nav-item active" : "top-nav-item"}>
          <Users size={18} /> Manage Users
        </NavLink>

        <NavLink to="/admin/events" className={({ isActive }) => isActive ? "top-nav-item active" : "top-nav-item"}>
          <Calendar size={18} /> Manage Events
        </NavLink>

        <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "top-nav-item active" : "top-nav-item"}>
          <Flag size={18} /> Reports
        </NavLink>
      </div>


      {/* Main Content */}
      <Outlet />
    </div>
  );
}


