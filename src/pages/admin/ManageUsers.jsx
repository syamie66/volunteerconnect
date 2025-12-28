import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { 
  Users, Eye, X, Shield, Heart, 
  Calendar, Target, MapPin, Phone, User, CheckCircle 
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

  // 2. Toggle Account Status (Enable/Disable)
  const toggleStatus = async (id, disabled) => {
    try {
      await updateDoc(doc(db, "users", id), { disabled: !disabled });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, disabled: !disabled } : u)));
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update status.");
    }
  };

  // 3. Handle NGO Verification
  const handleVerifyNGO = async (userId) => {
    if (window.confirm("Verify this organization? This will allow them to post events.")) {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { status: "Verified" });
        
        // Update local state so UI reflects change immediately
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Verified" } : u));
        alert("NGO has been verified! 🌱");
      } catch (error) {
        console.error("Error verifying NGO:", error);
        alert("Failed to verify NGO.");
      }
    }
  };

  // 4. Filter Logic (Tab + Search)
  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'NGO' 
      ? user.userType === 'NGO' 
      : user.userType === 'volunteer';
    
    const name = user.name || user.orgName || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="admin-dashboard-scope">
      <div className="content-container">
        
        <h1 className="page-title">Manage Users</h1>

        <div className="tab-group">
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`tab-btn ${activeTab === 'volunteer' ? 'active' : 'inactive'}`}
          >
            <Heart size={18} /> Volunteers
          </button>
          <button
            onClick={() => setActiveTab('NGO')}
            className={`tab-btn ${activeTab === 'NGO' ? 'active' : 'inactive'}`}
          >
            <Shield size={18} /> NGOs
          </button>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <h3>{activeTab === 'NGO' ? 'Registered Organizations' : 'Volunteer List'}</h3>
            <div className="search-bar" style={{ width: '250px', border: '1px solid #eee' }}>
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{activeTab === 'NGO' ? 'Organization Name' : 'Volunteer Name'}</th>
                  <th>Email</th>
                  {activeTab === 'volunteer' && <th>Phone</th>}
                  {activeTab === 'NGO' && <th>Founded</th>}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    // Logic for Status Tag
                    const currentStatus = user.status || (user.userType === 'NGO' ? 'Pending' : 'Verified');
                    
                    return (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className={`profile-pic ${activeTab === 'NGO' ? 'green-theme' : 'pink-theme'}`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                              {(user.name || user.orgName || "?").charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '600' }}>{user.name || user.orgName || "Unknown"}</span>
                          </div>
                        </td>
                        
                        <td>{user.email}</td>

                        {activeTab === 'volunteer' && <td>{user.phone || "-"}</td>}
                        {activeTab === 'NGO' && <td>{user.yearFounded || "-"}</td>}

                        <td>
                          {user.disabled ? (
                            <span className="status-tag error">Disabled</span>
                          ) : (
                            <span className={`status-tag ${currentStatus === 'Verified' ? 'success' : 'warning'}`}>
                              {currentStatus}
                            </span>
                          )}
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {/* View Details Button */}
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="btn-icon btn-view"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            
                            {/* NEW: Verification Button for Pending NGOs */}
                            {activeTab === 'NGO' && currentStatus === 'Pending' && !user.disabled && (
                                <button
                                  onClick={() => handleVerifyNGO(user.id)}
                                  className="btn-icon"
                                  style={{ backgroundColor: '#d1fae5', color: '#047857' }}
                                  title="Verify NGO"
                                >
                                  <CheckCircle size={18} />
                                </button>
                            )}

                            {/* Enable/Disable Button */}
                            <button
                              onClick={() => toggleStatus(user.id, user.disabled)}
                              className={`btn-toggle ${user.disabled ? 'is-active' : 'is-disabled'}`}
                            >
                              {user.disabled ? "Enable" : "Disable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                      No {activeTab} users found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- DETAILS MODAL --- */}
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {selectedUser.userType === 'NGO' ? <Shield size={24}/> : <User size={24}/>}
                  {selectedUser.name || selectedUser.orgName}
                </h2>
                <button className="btn-close" onClick={() => setSelectedUser(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                     <label>Email Address</label>
                     <p>{selectedUser.email}</p>
                  </div>
                  <div className="detail-item">
                     <label>Account Type</label>
                     <p style={{ textTransform: 'capitalize' }}>{selectedUser.userType}</p>
                  </div>

                  {selectedUser.userType === 'volunteer' && (
                    <>
                      <div className="detail-item">
                        <label>Phone Number</label>
                        <p>{selectedUser.phone || "N/A"}</p>
                      </div>
                      <div className="detail-item">
                        <label>Age & Gender</label>
                        <p>{selectedUser.age || "?"} yrs • {selectedUser.gender || "?"}</p>
                      </div>
                      <div className="detail-item span-full">
                        <label>Skills & Notes</label>
                        <div className="desc-box">
                          {selectedUser.skills || "No skills listed."}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedUser.userType === 'NGO' && (
                    <>
                      <div className="detail-item">
                        <label>Year Founded</label>
                        <p><Calendar size={16} color="#be185d" style={{display:'inline', marginRight:'5px'}}/> {selectedUser.yearFounded}</p>
                      </div>
                      <div className="detail-item span-full">
                        <label>Mission Statement</label>
                        <div className="mission-box" style={{ fontStyle: 'italic', borderLeft: '4px solid #be185d' }}>
                          "{selectedUser.missionStatement}"
                        </div>
                      </div>
                      <div className="detail-item span-full">
                        <label>Description</label>
                        <div className="desc-box">
                          {selectedUser.description || "No description provided."}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setSelectedUser(null)}>
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}