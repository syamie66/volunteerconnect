import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Users, Building2, Calendar, Activity } from "lucide-react";
import './AdminCSS.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    volunteers: 0, 
    ngos: 0, 
    events: 0,
    totalUsers: 0 
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const eventsSnap = await getDocs(collection(db, "events"));

        // Filter based on 'userType' saved in your Register.jsx
        const volunteers = usersSnap.docs.filter((d) => d.data().userType === "volunteer").length;
        const ngos = usersSnap.docs.filter((d) => d.data().userType === "NGO").length;
        const events = eventsSnap.size;

        setStats({ 
          volunteers, 
          ngos, 
          events,
          totalUsers: volunteers + ngos
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Calculate percentages for the dynamic Donut Chart
  const volPct = stats.totalUsers > 0 ? (stats.volunteers / stats.totalUsers) * 100 : 0;
  // The conic gradient needs a start and end point. 
  // Pink ends at volPct. Green starts at volPct and goes to 100%.
  const chartStyle = {
    background: `conic-gradient(
      var(--primary-pink) 0% ${volPct}%, 
      var(--primary-green) ${volPct}% 100%
    )`
  };

  return (
    // WRAPPER FOR SCOPED CSS
    <div className="admin-dashboard-scope">
      <div className="content-container">
        
        <h1 className="page-title">Platform Overview</h1>

        {/* DASHBOARD GRID: Left (Stats) & Right (Activity) */}
        <div className="dashboard-grid">
          
          {/* --- LEFT COLUMN --- */}
          <div className="left-col">
            
            {/* 1. CHART CARD */}
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>User Distribution</h3>
              
              <div className="chart-flex">
                <div className="donut-chart" style={chartStyle}>
                  <div className="center-text">
                    <span className="big-number">{stats.totalUsers}</span>
                  </div>
                </div>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="dot pink"></span>
                    {stats.volunteers} Volunteers
                  </div>
                  <div className="legend-item">
                    <span className="dot green"></span>
                    {stats.ngos} NGOs
                  </div>
                </div>
              </div>
            </div>

            {/* 2. STATS STACK */}
            <div className="stats-stack">
              
              {/* Pink Card: Volunteers */}
              <div className="stat-card pink-theme">
                <div className="stat-icon-box">
                  <Users size={24} color="#be185d" />
                </div>
                <div className="stat-info">
                  <p>Total Volunteers</p>
                  <h2>{stats.volunteers}</h2>
                </div>
                <div className="stat-badge text-pink-700">Live</div>
              </div>

              {/* Green Card: NGOs */}
              <div className="stat-card green-theme">
                <div className="stat-icon-box">
                  <Building2 size={24} color="#047857" />
                </div>
                <div className="stat-info">
                  <p>Registered NGOs</p>
                  <h2>{stats.ngos}</h2>
                </div>
                <div className="stat-badge text-green-800">Verified</div>
              </div>

              {/* Sage Card: Events */}
              <div className="stat-card sage-theme">
                <div className="stat-icon-box">
                  <Calendar size={24} color="#656d0a" />
                </div>
                <div className="stat-info">
                  <p>Active Events</p>
                  <h2>{stats.events}</h2>
                </div>
                <div className="stat-badge">New</div>
              </div>

            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="right-col">
            <div className="card table-card">
              <div className="card-header">
                <h3>Recent System Activity</h3>
                <button className="btn-toggle" style={{ fontSize: '0.75rem' }}>View All</button>
              </div>
              
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Activity Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Static data for demo purposes since we don't have an activity log collection yet */}
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="profile-pic pink-theme" style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>V</div>
                        <span className="type-label">New Volunteer</span>
                      </div>
                    </td>
                    <td>12/12/24</td>
                    <td><span className="status-tag success">Verified</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="profile-pic sage-theme" style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}><Activity size={14}/></div>
                        <span className="type-label">Event Created</span>
                      </div>
                    </td>
                    <td>12/11/24</td>
                    <td><span className="status-tag success">Active</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="profile-pic green-theme" style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>N</div>
                        <span className="type-label">New NGO</span>
                      </div>
                    </td>
                    <td>12/10/24</td>
                    <td><span className="status-tag error">Pending</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div className="profile-pic pink-theme" style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>V</div>
                         <span className="type-label">New Volunteer</span>
                      </div>
                    </td>
                    <td>12/09/24</td>
                    <td><span className="status-tag success">Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}