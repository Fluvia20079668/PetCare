import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // popup
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);

  const token = localStorage.getItem("admin_token") || "";

  // Fetchers
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === "success") setUsers(res.data.users);
    } catch (err) {
      console.error("fetchUsers:", err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === "success") setBookings(res.data.bookings);
    } catch (err) {
      console.error("fetchBookings:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  // actions
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const deleteBooking = async (type, id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`http://localhost:8080/admin/bookings/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const updateStatus = async (type, id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/admin/bookings/${type}/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const openDetails = (b) => {
    setDetailBooking(b);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailBooking(null);
    setDetailsOpen(false);
  };

  // SEARCH FILTERS
  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) =>
    ((b.user_name || "") + " " + (b.pet_name || "") + " " + (b.type || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // CHART DATA
  const bookingsByService = (() => {
    const counts = {};
    bookings.forEach((b) => {
      const t = b.type || b.serviceType || "unknown";
      counts[t] = (counts[t] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    return { labels, data };
  })();

  const bookingsOverTime = (() => {
    // group by created_at date (YYYY-MM-DD) or day field fallback
    const counts = {};
    bookings.forEach((b) => {
      const dt = (b.created_at && b.created_at.slice(0, 10)) || b.day || "unknown";
      counts[dt] = (counts[dt] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map((l) => counts[l]);
    return { labels, data };
  })();

  return (
    <div className="glass-admin">
      {/* SIDEBAR */}
      <aside className="glass-sidebar">
        <div className="glass-brand">
          <div className="brand-logo">🐾</div>
          <div>
            <div className="brand-title">PetCare+</div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>

        <nav className="glass-nav">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
          <button className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>Bookings</button>
        </nav>

        <div className="glass-footer">
          <button className="logout" onClick={() => { localStorage.removeItem("admin_token"); window.location.href = "/admin-login"; }}>
            Logout
          </button>
        </div>
      </aside>

      <main className="glass-main">
        <header className="glass-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <input className="glass-search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </header>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <section className="glass-cards">
            <div className="card glass">
              <div className="card-title">Total Users</div>
              <div className="card-value">{users.length}</div>
            </div>

            <div className="card glass">
              <div className="card-title">Total Bookings</div>
              <div className="card-value">{bookings.length}</div>
            </div>

            <div className="card glass">
              <div className="card-title">Pending</div>
              <div className="card-value">{bookings.filter((b) => b.status === "pending").length}</div>
            </div>

            <div className="card glass">
              <div className="card-title">Approved</div>
              <div className="card-value">{bookings.filter((b) => b.status === "pending").length}</div>
            </div>

            <div className="card glass">
              <div className="card-title">cancelled</div>
              <div className="card-value">{bookings.filter((b) => b.status === "pending").length}</div>
            </div>

            <div className="big-graphs">
              <div className="graph-card glass">
                <h3>Bookings by Service</h3>
                <Pie data={{
                  labels: bookingsByService.labels,
                  datasets: [{ data: bookingsByService.data, backgroundColor: ['#4c84ff','#6ee7b7','#f59e0b','#fb7185','#a78bfa','#60a5fa'] }]
                }} />
              </div>

              <div className="graph-card glass">
                <h3>Bookings over Time</h3>
                <Line data={{
                  labels: bookingsOverTime.labels,
                  datasets: [{ label: 'Bookings', data: bookingsOverTime.data, fill: true, tension: 0.3 }]
                }} />
              </div>
            </div>
          </section>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <section>
            <div className="glass-table-wrap">
              <table className="glass-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td>{u.created_at ? u.created_at.slice(0,10) : "-"}</td>
                      <td><button className="btn danger" onClick={() => deleteUser(u.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <section>
            <div className="glass-table-wrap">
              <table className="glass-table">
                <thead>
                  <tr><th>ID</th><th>User</th><th>Pet</th><th>Service</th><th>Status</th><th>Day</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7">Loading…</td></tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr><td colSpan="7">No bookings found</td></tr>
                  ) : filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.user_name}</td>
                      <td>{b.pet_name}</td>
                      <td>{b.type}</td>
                      <td>
                        <select className="status" value={b.status} onChange={(e) => updateStatus(b.type, b.id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{b.day}</td>
                      <td className="actions">
                        <button className="btn view" onClick={() => openDetails(b)}>View</button>
                        <button className="btn danger" onClick={() => deleteBooking(b.type, b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* DETAILS POPUP */}
      {detailsOpen && detailBooking && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Booking Details</h3>
              <button className="close" onClick={closeDetails}>✕</button>
            </header>

            <div className="modal-body">
              <p><strong>ID:</strong> {detailBooking.id}</p>
              <p><strong>User:</strong> {detailBooking.user_name} (#{detailBooking.userId})</p>
              <p><strong>Service:</strong> {detailBooking.type}</p>
              <p><strong>Pet:</strong> {detailBooking.pet_name} — {detailBooking.petType}</p>
              <p><strong>Slot & Day:</strong> {detailBooking.slot} • {detailBooking.day}</p>
              <p><strong>Description:</strong><br/>{detailBooking.description || "-"}</p>
              <p><strong>Status:</strong> {detailBooking.status}</p>
              <p><strong>Created:</strong> {detailBooking.created_at || "-"}</p>
            </div>

            <footer className="modal-footer">
              <button className="btn" onClick={() => { updateStatus(detailBooking.type, detailBooking.id, "approved"); closeDetails(); }}>Approve</button>
              <button className="btn danger" onClick={() => { updateStatus(detailBooking.type, detailBooking.id, "cancelled"); closeDetails(); }}>Cancel Booking</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
