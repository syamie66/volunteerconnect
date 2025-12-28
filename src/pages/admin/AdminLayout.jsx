import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Users, Calendar, Flag, LogOut, Search, Bell } from "lucide-react";
import './AdminCSS.css';

export default function AdminLayout() {
  return (
    // We use the scoped class to apply the Green/Pink theme to the whole layout
    <div className="admin-dashboard-scope">
      
      {/* --- SIDEBAR --- */}
      <aside className="admin-sidebar">
        <div className="logo-area">
          <h2>Volunteer<span>Connect</span></h2>
        </div>
        
        <nav className="nav-menu">
          <p className="menu-label">Menu</p>
          
          {/* Dashboard Link */}
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <Home size={18} /> Dashboard
          </NavLink>

          {/* Manage Users Link */}
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <Users size={18} /> Manage Users
          </NavLink>

          {/* Manage Events Link */}
          <NavLink 
            to="/admin/events" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <Calendar size={18} /> Manage Events
          </NavLink>
        </nav>

        <div className="logout-area">
          <button className="nav-item logout"><LogOut size={18} /> Log out</button>
        </div>
      </aside>

      {/* --- MAIN CONTENT SHELL --- */}
      <main className="admin-main">
        {/* Persistent Header (Search bar, Profile) */}
        <header className="admin-header">
          <div className="header-actions">
          </div>
        </header>

        {/* Dynamic Page Content Rendered Here */}
        <div className="content-container">
           <Outlet /> 
        </div>
      </main>
    </div>
  );
}