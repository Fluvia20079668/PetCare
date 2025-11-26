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
        fetch(`${apiBase}/users`).then(r => r.json()),
        fetch(`${apiBase}/bookings`).then(r => r.json()),
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
    if (!window.confirm("Delete this user? This will remove their bookings if FK cascade is enabled.")) return;
    const res = await fetch(`${apiBase}/users/${id}`, { method: "DELETE" }).then(r => r.json());
    if (res.status === "success") {
      setUsers(u => u.filter(x => x.id !== id));
      alert("User deleted");
    } else alert("Failed to delete user");
  };

  const deleteBooking = async (type, id) => {
    if (!window.confirm("Delete this booking?")) return;
    const res = await fetch(`${apiBase}/bookings/${type}/${id}`, { method: "DELETE" }).then(r => r.json());
    if (res.status === "success") {
      setBookings(b => b.filter(x => !(x.type === type && x.id === id)));
      alert("Booking deleted");
    } else alert("Failed to delete booking");
  };

  const updateStatus = async (type, id, status) => {
    const res = await fetch(`${apiBase}/bookings/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(r => r.json());
    if (res.status === "success") {
      setBookings(b => b.map(x => (x.type === type && x.id === id ? { ...x, status } : x)));
    } else {
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      {loading ? <p>Loading…</p> : (
        <>
          <section className="admin-section">
            <h2>Users ({users.length})</h2>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.created_at}</td>
                    <td>
                      <button className="small danger" onClick={() => deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-section">
            <h2>Bookings ({bookings.length})</h2>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Type</th><th>User</th><th>Pet</th><th>Pet Type</th><th>Slot</th><th>Day</th><th>Status</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={`${b.type}-${b.id}`}>
                    <td>{b.id}</td>
                    <td>{b.type}</td>
                    <td>{b.user_name}</td>
                    <td>{b.pet_name}</td>
                    <td>{b.pet_type}</td>
                    <td>{b.slot}</td>
                    <td>{b.day}</td>
                    <td className={`status ${b.status}`}>{b.status}</td>
                    <td>{b.created_at}</td>
                    <td>
                      <button className="small" onClick={() => updateStatus(b.type, b.id, "approved")}>Approve</button>
                      <button className="small" onClick={() => updateStatus(b.type, b.id, "rejected")}>Reject</button>
                      <button className="small" onClick={() => updateStatus(b.type, b.id, "completed")}>Complete</button>
                      <button className="small danger" onClick={() => deleteBooking(b.type, b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
