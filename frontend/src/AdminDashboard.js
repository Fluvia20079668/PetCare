import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBase = "http://localhost:8080/api/admin";

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [uRes, bRes] = await Promise.all([
        fetch(`${apiBase}/users`).then((r) => r.json()),
        fetch(`${apiBase}/bookings`).then((r) => r.json()),
      ]);
      if (uRes.status === "success") setUsers(uRes.users || []);
      if (bRes.status === "success") setBookings(bRes.bookings || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await fetch(`${apiBase}/users/${id}`, { method: "DELETE" }).then((r) => r.json());
    if (res.status === "success") setUsers((u) => u.filter((x) => x.id !== id));
  };

  const deleteBooking = async (type, id) => {
    if (!window.confirm("Delete this booking?")) return;
    const res = await fetch(`${apiBase}/bookings/${type}/${id}`, { method: "DELETE" }).then((r) => r.json());
    if (res.status === "success") setBookings((b) => b.filter((x) => !(x.type === type && x.id === id)));
  };

  const updateStatus = async (type, id, status) => {
    const res = await fetch(`${apiBase}/bookings/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((r) => r.json());
    if (res.status === "success") {
      setBookings((b) =>
        b.map((x) => (x.type === type && x.id === id ? { ...x, status } : x))
      );
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">🐾 PetCare Admin</h2>

        <nav>
          <button className="sidebar-btn active">Users</button>
          <button className="sidebar-btn">Bookings</button>
        </nav>
      </aside>

      <main className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{bookings.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p>{bookings.filter((b) => b.status === "pending").length}</p>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="admin-section">
          <h2>Users</h2>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                    <td>{u.created_at}</td>
                    <td>
                      <button className="btn danger" onClick={() => deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* BOOKINGS TABLE */}
        <div className="admin-section">
          <h2>Bookings</h2>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Type</th><th>User</th><th>Pet</th><th>Slot</th><th>Day</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={`${b.type}-${b.id}`}>
                    <td>{b.id}</td>
                    <td>{b.type}</td>
                    <td>{b.user_name}</td>
                    <td>{b.pet_name}</td>
                    <td>{b.slot}</td>
                    <td>{b.day}</td>
                    <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                    <td>
                      <button className="btn approve" onClick={() => updateStatus(b.type, b.id, "approved")}>Approve</button>
                      <button className="btn reject" onClick={() => updateStatus(b.type, b.id, "rejected")}>Reject</button>
                      <button className="btn complete" onClick={() => updateStatus(b.type, b.id, "completed")}>Complete</button>
                      <button className="btn danger" onClick={() => deleteBooking(b.type, b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
