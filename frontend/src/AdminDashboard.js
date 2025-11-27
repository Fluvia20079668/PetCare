import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // ==== DATA STATES ====
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  // ==== LOADING STATES ====
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const token = localStorage.getItem("token");

  // -------------------------------
  //  FETCH USERS
  // -------------------------------
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === "success") setUsers(data.users);
    } catch (err) {
      console.log("Users load error:", err);
    }
    setLoadingUsers(false);
  };

  // -------------------------------
  //  FETCH BOOKINGS
  // -------------------------------
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch("http://localhost:8080/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === "success") setBookings(data.bookings);
    } catch (err) {
      console.log("Bookings load error:", err);
    }
    setLoadingBookings(false);
  };

  // -------------------------------
  //  DELETE USER
  // -------------------------------
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:8080/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  // -------------------------------
  //  DELETE BOOKING
  // -------------------------------
  const deleteBooking = async (type, id) => {
    if (!window.confirm("Delete this booking?")) return;

    await fetch(`http://localhost:8080/api/admin/bookings/${type}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchBookings();
  };

  // -------------------------------
  //  UPDATE BOOKING STATUS
  // -------------------------------
  const updateStatus = async (type, id, status) => {
    await fetch(`http://localhost:8080/api/admin/bookings/${type}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    fetchBookings();
  };

  // -------------------------------
  //  Load data on mount
  // -------------------------------
  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

  // -------------------------------
  //  FILTER SEARCH
  // -------------------------------
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) =>
    b.user_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-wrap">

      {/* SIDEBAR */}
      <aside className="adm-sidebar">
        <div className="brand">
          <div className="logo">🐾</div>
          <div>
            <div className="brand-name">PetCare+</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            className={`nav-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="adm-main">
        <div className="adm-header">
          <h1 className="page-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>

          <div className="adm-search">
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="cards">
            <div className="card">
              <div className="card-title">Total Users</div>
              <div className="card-value">{users.length}</div>
            </div>

            <div className="card">
              <div className="card-title">Total Bookings</div>
              <div className="card-value">{bookings.length}</div>
            </div>

            <div className="card">
              <div className="card-title">Pending</div>
              <div className="card-value">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
            </div>
          </div>
        )}

        {/* USERS TABLE */}
        {activeTab === "users" && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingUsers ? (
                  <tr><td colSpan="6">Loading users…</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="6">No users found</td></tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.created_at?.slice(0, 10)}</td>
                      <td>
                        <button
                          className="btn danger"
                          onClick={() => deleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOKINGS TABLE */}
        {activeTab === "bookings" && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Pet</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Day</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingBookings ? (
                  <tr><td colSpan="7">Loading bookings…</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="7">No bookings found</td></tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.user_name}</td>
                      <td>{b.pet_name}</td>
                      <td>{b.type}</td>

                      <td>
                        <select
                          value={b.status}
                          onChange={(e) =>
                            updateStatus(b.type, b.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      <td>{b.day}</td>

                      <td>
                        <button
                          className="btn danger"
                          onClick={() => deleteBooking(b.type, b.id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
