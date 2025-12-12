import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Calendar, Trash2, Eye } from "lucide-react";
import './AdminCSS.css';


export default function ManageEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    await deleteDoc(doc(db, "events", id));
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-red-700 flex items-center gap-3">
        <Calendar size={32} /> Manage Events
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="p-3">Event Name</th>
              <th className="p-3">NGO</th>
              <th className="p-3">Date</th>
              <th className="p-3">Location</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-red-50 transition">
                <td className="p-3 font-medium">{event.title}</td>
                <td className="p-3">{event.ngoName || "Unknown NGO"}</td>
                <td className="p-3">{event.date}</td>
                <td className="p-3">{event.location}</td>

                <td className="p-3 flex gap-3">
                  <button
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Eye size={16} /> View
                  </button>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
