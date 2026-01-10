import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Users, Building2, Calendar, Activity } from "lucide-react";
import './AdminCSS.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    volunteers: 0, 
    ngos: 0, 
    events: 0,
    totalUsers: 0 
  });
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Raw Data
        const usersSnap = await getDocs(collection(db, "users"));
        const eventsSnap = await getDocs(collection(db, "events"));

        const volunteers = usersSnap.docs.filter((d) => d.data().userType === "volunteer").length;
        const ngos = usersSnap.docs.filter((d) => d.data().userType === "NGO").length;
        const eventsCount = eventsSnap.size;

        setStats({ 
          volunteers, 
          ngos, 
          events: eventsCount,
          totalUsers: volunteers + ngos
        });

        // 2. Fetch & Merge Recent Activity with Real Status Logic
        const userActivities = usersSnap.docs.map(doc => {
          const data = doc.data();
          // Logic: If user is NGO and has no status, default to "Pending"
          const realStatus = data.status || (data.userType === "NGO" ? "Pending" : "Verified");
          
          return {
            id: doc.id,
            type: data.userType === "NGO" ? "New NGO" : "New Volunteer",
            date: data.createdAt?.toDate() || new Date(),
            status: realStatus,
            category: data.userType 
          };
        });

        const eventActivities = eventsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "Event Created",
            date: data.createdAt?.toDate() || new Date(),
            status: "Active",
            category: "event"
          };
        });

        // Combine and Sort by Date (Descending)
        const combinedActivities = [...userActivities, ...eventActivities]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5);

        setActivities(combinedActivities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const volPct = stats.totalUsers > 0 ? (stats.volunteers / stats.totalUsers) * 100 : 0;
  const chartStyle = {
    background: `conic-gradient(var(--primary-pink) 0% ${volPct}%, var(--primary-green) ${volPct}% 100%)`
  };

  if (loading) return <div className="admin-loader">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard-scope">
      <div className="content-container admin-layout-compact">
        
        <header className="compact-header">
          <h1 className="page-title">Platform Overview</h1>
          <div className="live-tag">● System Live</div>
        </header>

        {/* STATS SUMMARY */}
        <div className="compact-stats-row">
          <div className="stat-card-mini pink-theme">
            <Users size={20} color="#be185d" />
            <div className="info">
              <p>Volunteers</p>
              <h3>{stats.volunteers}</h3>
            </div>
          </div>
          <div className="stat-card-mini green-theme">
            <Building2 size={20} color="#047857" />
            <div className="info">
              <p>Registered NGOs</p>
              <h3>{stats.ngos}</h3>
            </div>
          </div>
          <div className="stat-card-mini sage-theme">
            <Calendar size={20} color="#656d0a" />
            <div className="info">
              <p>Active Events</p>
              <h3>{stats.events}</h3>
            </div>
          </div>
        </div>

        <div className="compact-main-grid">
          {/* USER DISTRIBUTION CHART */}
          <div className="card chart-section">
            <h3>User Distribution</h3>
            <div className="donut-box">
              <div className="donut-chart" style={chartStyle}>
                <div className="center-text">
                  <span className="big-number">{stats.totalUsers}</span>
                </div>
              </div>
              <div className="compact-legend">
                <div className="legend-item"><span className="dot pink"></span> {stats.volunteers} Volunteers</div>
                <div className="legend-item"><span className="dot green"></span> {stats.ngos} NGOs</div>
              </div>
            </div>
          </div>

          {/* ACTIVITY TABLE */}
          <div className="card activity-section">
            <div className="card-header">
              <h3>Recent System Activity</h3>
            </div>
            <div className="table-responsive-area">
              <table className="admin-table-compact">
                <thead>
                  <tr>
                    <th>Activity Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr 
                      key={activity.id} 
                      onClick={() => activity.status === "Pending" && navigate('/admin/users')}
                      style={{ cursor: activity.status === "Pending" ? 'pointer' : 'default' }}
                      title={activity.status === "Pending" ? "Click to verify NGO" : ""}
                      className={activity.status === "Pending" ? "clickable-row" : ""}
                    >
                      <td>
                        <div className="type-icon-cell">
                          <div className={`mini-pic ${
                            activity.category === "volunteer" ? "pink-theme" : 
                            activity.category === "NGO" ? "green-theme" : "sage-theme"
                          }`}>
                            {activity.category === "event" ? <Activity size={12}/> : activity.type.charAt(4)}
                          </div>
                          <span>{activity.type}</span>
                        </div>
                      </td>
                      <td>{activity.date.toLocaleDateString()}</td>
                      <td>
                        <span className={`status-tag ${
                          activity.status === "Verified" || activity.status === "Active" ? "success" : "warning"
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}