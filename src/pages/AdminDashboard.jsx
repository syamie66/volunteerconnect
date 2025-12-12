import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Users, Calendar, Building2 } from "lucide-react";
import './AdminCSS.css';


export default function AdminDashboard() {
  const [stats, setStats] = useState({ volunteers: 0, ngos: 0, events: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const eventsSnap = await getDocs(collection(db, "events"));

      const volunteers = usersSnap.docs.filter((d) => d.data().role === "volunteer").length;
      const ngos = usersSnap.docs.filter((d) => d.data().role === "ngo").length;
      const events = eventsSnap.size;

      setStats({ volunteers, ngos, events });
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-red-700">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Volunteers */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6">
          <div className="p-4 rounded-xl bg-red-100">
            <Users size={32} className="text-red-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Volunteers</h2>
            <p className="text-3xl font-semibold">{stats.volunteers}</p>
          </div>
        </div>

        {/* NGOs */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6">
          <div className="p-4 rounded-xl bg-red-100">
            <Building2 size={32} className="text-red-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold">NGOs</h2>
            <p className="text-3xl font-semibold">{stats.ngos}</p>
          </div>
        </div>

        {/* Events */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6">
          <div className="p-4 rounded-xl bg-red-100">
            <Calendar size={32} className="text-red-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Total Events</h2>
            <p className="text-3xl font-semibold">{stats.events}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
