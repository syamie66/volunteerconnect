import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Users } from "lucide-react";
import './AdminCSS.css';


export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        alert("You do not have permission to view users.");
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (id, disabled) => {
    try {
      await updateDoc(doc(db, "users", id), { disabled: !disabled });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, disabled: !disabled } : u)));
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("You do not have permission to update this user.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-red-700 flex items-center gap-3">
        <Users size={32} /> Manage Users
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">User Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-red-50 transition">
                <td className="p-3 font-medium">{user.name || "No Name"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.userType}</td>
                <td className="p-3">
                  {user.disabled ? (
                    <span className="text-red-600 font-semibold">Disabled</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(user.id, user.disabled)}
                    className={`px-4 py-2 rounded-xl text-white shadow-md transition ${
                      user.disabled
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.disabled ? "Enable" : "Disable"}
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
