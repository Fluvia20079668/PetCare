import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
      alert("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  // --- SAFE CONFIRM MODAL ---
  const safeConfirm = (message) => window.confirm(message); // no ESLint error

  // DELETE USER
  const deleteUser = async (id) => {
    if (!safeConfirm("Delete this user?")) return;

    const res = await fetch(`${apiBase}/users/${id}`, { method: "DELETE" }).then((r) => r.json());

    if (res.status === "success") {
      setUsers((u) => u.filter((x) => x.id !== id));
    } else alert("Failed to delete user");
  };

  // DELETE BOOKING
  const deleteBooking = async (type, id) => {
    if (!safeConfirm("Delete this booking?")) return;

    const res = await fetch(`${apiBase}/bookings/${type}/${id}`, {
      method: "DELETE",
    }).then((r) => r.json());

    if (res.status === "success") {
      setBookings((b) => b.filter((x) => !(x.type === type && x.id === id)));
    }
  };

  // UPDATE BOOKING STATUS
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

  // SIMPLE ANALYTICS
  const stats = {
    totalUsers: users.length,
    totalBookings: bookings.length,
    completed: bookings.filter((b) => b.status === "completed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
  };

  return (
    <div className={`admin-wrap ${darkMode ? "dark" : ""}`}>
      {/* SIDEBAR */}
      <aside className="adm-sidebar">
        <h2 className="logo">PetCare Admin</h2>

        <nav>
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            📊 Dashboard
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            👤 Users
          </button>
          <button className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>
            📅 Bookings
          </button>
        </nav>

        <div className="dark-toggle">
          <label>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            Dark Mode
          </label>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="adm-main">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            {/* DASHBOARD ANALYTICS */}
            {activeTab === "dashboard" && (
              <div className="dash-cards">
                <div className="card">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                </div>
                <div className="card">
                  <h3>Total Bookings</h3>
                  <p>{stats.totalBookings}</p>
                </div>
                <div className="card">
                  <h3>Pending</h3>
                  <p>{stats.pending}</p>
                </div>
                <div className="card">
                  <h3>Completed</h3>
                  <p>{stats.completed}</p>
                </div>
              </div>
            )}

            {/* USERS TABLE */}
            {activeTab === "users" && (
              <section>
                <h2>Users</h2>

                <table className="adm-table">
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
                        <td>{u.role}</td>
                        <td>{u.created_at}</td>
                        <td>
                          <button className="danger" onClick={() => deleteUser(u.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* BOOKINGS TABLE */}
            {activeTab === "bookings" && (
              <section>
                <h2>Bookings</h2>

                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Type</th><th>User</th><th>Pet</th><th>Pet Type</th>
                      <th>Slot</th><th>Day</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={`${b.type}-${b.id}`}>
                        <td>{b.id}</td>
                        <td>{b.type}</td>
                        <td>{b.user_name}</td>
                        <td>{b.pet_name}</td>
                        <td>{b.pet_type}</td>
                        <td>{b.slot}</td>
                        <td>{b.day}</td>
                        <td className={`status ${b.status}`}>{b.status}</td>
                        <td>
                          <button onClick={() => updateStatus(b.type, b.id, "approved")}>Approve</button>
                          <button onClick={() => updateStatus(b.type, b.id, "rejected")}>Reject</button>
                          <button onClick={() => updateStatus(b.type, b.id, "completed")}>Complete</button>
                          <button className="danger" onClick={() => deleteBooking(b.type, b.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
