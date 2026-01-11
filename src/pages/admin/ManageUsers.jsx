import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";
import { 
  Users, Eye, X, Shield, Heart, 
  Calendar, Trash2, CheckCircle, User
} from "lucide-react";
import './AdminCSS.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('volunteer'); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, []);

  // 2. Toggle Account Status
  const toggleStatus = async (id, disabled) => {
    try {
      await updateDoc(doc(db, "users", id), { disabled: !disabled });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, disabled: !disabled } : u)));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // 3. Handle NGO Verification
  const handleVerifyNGO = async (userId) => {
    if (window.confirm("Verify this organization?")) {
      try {
        await updateDoc(doc(db, "users", userId), { status: "Verified" });
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Verified" } : u));
      } catch (error) {
        console.error("Error verifying NGO:", error);
      }
    }
  };

  // --- 4. DEBUGGED DELETE FUNCTION ---
  const handleDeleteUser = async (user) => {
    // 1. Determine if user is NGO (Check both 'userType' and 'role')
    const type = user.userType || user.role || '';
    const isNGO = type.toLowerCase() === 'ngo';

    console.log("--- START DELETE PROCESS ---");
    console.log("User ID:", user.id);
    console.log("Detected Type:", type);
    console.log("Is NGO?", isNGO);

    const confirmMessage = isNGO 
      ? `WARNING: You are deleting an NGO.\nThis will also delete ALL events created by them.\n\nProceed?`
      : "Are you sure you want to delete this user?";

    if (!window.confirm(confirmMessage)) return;

    try {
      if (isNGO) {
        console.log("Searching for associated events...");
        const eventsRef = collection(db, "events");

        // QUERY 1: Check 'createdBy'
        const q1 = query(eventsRef, where("createdBy", "==", user.id));
        const snap1 = await getDocs(q1);
        console.log(`Found ${snap1.size} events via 'createdBy'`);

        // QUERY 2: Check 'organizerId' (Backup)
        const q2 = query(eventsRef, where("organizerId", "==", user.id));
        const snap2 = await getDocs(q2);
        console.log(`Found ${snap2.size} events via 'organizerId'`);

        // Combine results
        const allEvents = [...snap1.docs, ...snap2.docs];
        
        // Remove duplicates (in case an event matched both queries)
        const uniqueEvents = Array.from(new Set(allEvents.map(d => d.id)))
            .map(id => allEvents.find(d => d.id === id));

        if (uniqueEvents.length > 0) {
            console.log(`Deleting ${uniqueEvents.length} unique events...`);
            const deletePromises = uniqueEvents.map(d => deleteDoc(d.ref));
            await Promise.all(deletePromises);
            console.log("Events deleted successfully.");
        } else {
            console.log("No events found for this NGO.");
        }
      }

      // Delete the User
      console.log("Deleting user profile...");
      await deleteDoc(doc(db, "users", user.id));
      
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelectedUser(null);
      alert("User and data deleted successfully.");

    } catch (error) {
      console.error("DELETE FAILED:", error);
      alert("Error: " + error.message);
    }
  };

  // 5. Filter Logic
  const filteredUsers = users.filter(user => {
    // Normalize type check
    const type = user.userType || user.role || 'volunteer';
    const isNGO = type.toLowerCase() === 'ngo';
    
    // Tab filtering
    if (activeTab === 'NGO' && !isNGO) return false;
    if (activeTab === 'volunteer' && isNGO) return false;

    // Search filtering
    const name = user.name || user.orgName || '';
    const email = user.email || '';
    const term = searchTerm.toLowerCase();
    
    return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
  });

  return (
    <div className="admin-dashboard-scope">
      <div className="content-container">
        
        <h1 className="page-title">Manage Users</h1>

        <div className="tab-group">
          <button onClick={() => setActiveTab('volunteer')} className={`tab-btn ${activeTab === 'volunteer' ? 'active' : 'inactive'}`}>
            <Heart size={18} /> Volunteers
          </button>
          <button onClick={() => setActiveTab('NGO')} className={`tab-btn ${activeTab === 'NGO' ? 'active' : 'inactive'}`}>
            <Shield size={18} /> NGOs
          </button>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <h3>{activeTab === 'NGO' ? 'Registered Organizations' : 'Volunteer List'}</h3>
            <div className="search-bar" style={{ width: '250px', border: '1px solid #eee' }}>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                   const currentStatus = user.status || 'Verified'; 
                   return (
                      <tr key={user.id}>
                        <td>{user.name || user.orgName}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.disabled ? <span className="status-tag error">Disabled</span> : 
                           <span className="status-tag success">{currentStatus}</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setSelectedUser(user)} className="btn-icon btn-view"><Eye size={18}/></button>
                            <button onClick={() => toggleStatus(user.id, user.disabled)} className="btn-toggle">
                                {user.disabled ? "Enable" : "Disable"}
                            </button>
                            {/* Pass the WHOLE user object here */}
                            <button onClick={() => handleDeleteUser(user)} className="btn-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                                <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}