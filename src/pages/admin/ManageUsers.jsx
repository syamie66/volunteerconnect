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
  Eye, Shield, Heart, 
  Trash2, CheckCircle, AlertCircle
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

  // 2. Toggle Account Status (Disable/Enable)
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
    if (window.confirm("Are you sure you want to verify this organization? This will allow them to post events.")) {
      try {
        // Update Firestore status to 'Verified'
        await updateDoc(doc(db, "users", userId), { status: "Verified" });
        
        // Update local state immediately
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Verified" } : u));
      } catch (error) {
        console.error("Error verifying NGO:", error);
        alert("Failed to verify NGO. Check console for details.");
      }
    }
  };

  // 4. Delete User Logic
  const handleDeleteUser = async (user) => {
    const type = user.userType || user.role || '';
    const isNGO = type.toLowerCase() === 'ngo';

    const confirmMessage = isNGO 
      ? `WARNING: You are deleting an NGO.\nThis will also delete ALL events created by them.\n\nProceed?`
      : "Are you sure you want to delete this user?";

    if (!window.confirm(confirmMessage)) return;

    try {
      if (isNGO) {
        const eventsRef = collection(db, "events");
        const q1 = query(eventsRef, where("createdBy", "==", user.id));
        const snap1 = await getDocs(q1);
        const q2 = query(eventsRef, where("organizerId", "==", user.id));
        const snap2 = await getDocs(q2);
        
        const allEvents = [...snap1.docs, ...snap2.docs];
        const uniqueEvents = Array.from(new Set(allEvents.map(d => d.id)))
            .map(id => allEvents.find(d => d.id === id));

        if (uniqueEvents.length > 0) {
            const deletePromises = uniqueEvents.map(d => deleteDoc(d.ref));
            await Promise.all(deletePromises);
        }
      }

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
    const type = user.userType || user.role || 'volunteer';
    const isNGO = type.toLowerCase() === 'ngo';
    
    if (activeTab === 'NGO' && !isNGO) return false;
    if (activeTab === 'volunteer' && isNGO) return false;

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
                   // --- LOGIC FOR STATUS DISPLAY ---
                   const userRole = user.userType || user.role || '';
                   const isNGO = userRole.toLowerCase() === 'ngo';
                   
                   // If status is undefined, default to 'Pending' for NGOs
                   const status = user.status || (isNGO ? 'Pending' : 'Verified');
                   const isVerified = status === 'Verified';

                   return (
                      <tr key={user.id}>
                        <td>{user.name || user.orgName}</td>
                        <td>{user.email}</td>
                        <td>
                          {/* 1. Account Disabled Tag */}
                          {user.disabled && <span className="status-tag error" style={{marginRight: '5px'}}>Disabled</span>}
                          
                          {/* 2. Verification Status Tag */}
                          {!user.disabled && (
                            isVerified 
                              ? <span className="status-tag success">Verified</span>
                              : <span className="status-tag warning"><AlertCircle size={12} style={{marginRight:4}}/> Pending</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            
                            {/* NEW: Verify Button (Only shows for unverified NGOs) */}
                            {isNGO && !isVerified && !user.disabled && (
                                <button 
                                    onClick={() => handleVerifyNGO(user.id)} 
                                    className="btn-icon"
                                    style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                                    title="Verify NGO"
                                >
                                    <CheckCircle size={18}/>
                                </button>
                            )}

                            <button onClick={() => setSelectedUser(user)} className="btn-icon btn-view" title="View Details">
                                <Eye size={18}/>
                            </button>
                            
                            <button onClick={() => toggleStatus(user.id, user.disabled)} className="btn-toggle">
                                {user.disabled ? "Enable" : "Disable"}
                            </button>
                            
                            <button onClick={() => handleDeleteUser(user)} className="btn-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }} title="Delete User">
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
      
      {/* Optional: Simple Modal to view details */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>User Details</h3>
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Name:</strong> {selectedUser.name || selectedUser.orgName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role || selectedUser.userType}</p>
                <p><strong>Status:</strong> {selectedUser.status || 'Pending'}</p>
                <button onClick={() => setSelectedUser(null)} style={{marginTop: '20px'}}>Close</button>
            </div>
        </div>
      )}
    </div>
  );
}