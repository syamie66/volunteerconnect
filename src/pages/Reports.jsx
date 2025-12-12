import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Flag, Trash2 } from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const snap = await getDocs(collection(db, "reports"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReports(data);
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    await deleteDoc(doc(db, "reports", id));
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-red-700 flex items-center gap-3">
        <Flag size={32} /> Reports
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="p-3">User</th>
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No reports submitted.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b hover:bg-red-50 transition">
                  <td className="p-3 font-medium">{r.userEmail}</td>
                  <td className="p-3 capitalize">{r.type}</td>
                  <td className="p-3">{r.message}</td>
                  <td className="p-3">{r.date || "Unknown"}</td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
