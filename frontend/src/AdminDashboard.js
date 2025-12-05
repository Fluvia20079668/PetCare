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
  Legend,
  Filler
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
  Legend,
  Filler
);

// set axios default baseURL if your server runs at a specific host
axios.defaults.baseURL = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  // model for viewing booking details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);

  //JWT token from localstor
  const token = localStorage.getItem("admin_token") || "";
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  //  Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get("/admin/users", { headers: authHeaders });
      if (res.data.status === "success") setUsers(res.data.users || []);
      else setError(res.data.error || "Failed to fetch users");
    } catch (err) {
      console.error("fetchUsers:", err);
      setError(err.message || "fetchUsers error");
    } finally {
      setLoadingUsers(false);
    }
  };
//Fetch Bookings done by cosomers
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await axios.get("/admin/bookings", { headers: authHeaders });
      if (res.data.status === "success") setBookings(res.data.bookings || []);
      else setError(res.data.error || "Failed to fetch bookings");
    } catch (err) {
      setError("fetchBookings error");
    } 
      setLoadingBookings(false);
    
  };

  useEffect(() => {
    fetchUsers();
    fetchBookings();
   
  }, []);

  // Delete users from admin  
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`, { headers: authHeaders });
      await fetchUsers();
    } catch  
    {
      alert("Failed to delete user");
    }
  };
// Delete booking 
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`/admin/bookings/${id}`, { headers: authHeaders });
      await fetchBookings();
    } catch 
     {
     
      alert("Delete failed");
    }
  };
//Upadte the Booking status 
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/admin/bookings/${id}`,
        { status },
        { headers: { ...authHeaders, "Content-Type": "application/json" } }
      );
      fetchBookings();
    } catch 
    {
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
  const lower = search.toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(lower) ||
      (u.email || "").toLowerCase().includes(lower)
  );

  const filteredBookings = bookings.filter((b) =>
    (
      (b.user_name || "") +
      " " +
      (b.pet_name || "") +
      " " +
      (b.type || "") +
      " " +
      (b.day || "")
    )
      .toLowerCase()
      .includes(lower)
  );

  // chart data about  bookings
const bookingsByService = (() => {
const map = {};
bookings.forEach((b) => {
const service = b.type || "Unknown";
map[service] = (map[service] || 0) + 1;
});
return { labels: Object.keys(map), data: Object.values(map) };
})();


const bookingsOverTime = (() => {
const map = {};
bookings.forEach((b) => {
const date = (b.created_at || "").slice(0, 10);
if (!date) return;
map[date] = (map[date] || 0) + 1;
});


const labels = Object.keys(map).sort();
return { labels, data: labels.map((l) => map[l]) };
})();

  // dashboard counters
  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const approved  = bookings.filter((b) => b.status === "approved").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

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
        <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>
        Dashboard
        </button>
        <button onClick={() => setActiveTab("users")} className={activeTab === "users" ? "active" : ""}>
        Users
        </button>
        <button onClick={() => setActiveTab("bookings")} className={activeTab === "bookings" ? "active" : ""}>
        Bookings
        </button>
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

        {error && <div className="error">{error}</div>}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <section className="glass-cards">
            <div className="card glass">
              <div className="card-title">Total Users</div>
              <div className="card-value">{loadingUsers ? "…" : totalUsers}</div>
            </div>

            <div className="card glass">
              <div className="card-title">Total Bookings</div>
              <div className="card-value">{loadingBookings ? "…" : totalBookings}</div>
            </div>

            <div className="card glass">
              <div className="card-title">Pending</div>
              <div className="card-value">{loadingBookings ? "…" : pendingCount}</div>
            </div>

            <div className="card glass">
            <div className="card-title">Approved</div>
            <div className="card-value">{approved}</div>
            </div>

            <div className="card glass">
              <div className="card-title">Cancelled</div>
              <div className="card-value">{loadingBookings ? "…" : cancelledCount}</div>
            </div>

            <div className="big-graphs">
              <div className="graph-card glass">
                <h3>Bookings by Service</h3>
                {bookingsByService.labels.length ? (
                  <Pie data={{
                    labels: bookingsByService.labels,
                    datasets: [{ data: bookingsByService.data }]
                  }} />
                ) : (
                  <div>No data</div>
                )}
              </div>

              <div className="graph-card glass">
                <h3>Bookings over Time</h3>
                {bookingsOverTime.labels.length ? (
                  <Line data={{
                    labels: bookingsOverTime.labels,
                    datasets: [{ label: 'Bookings', data: bookingsOverTime.data, fill: true, tension: 0.3 }]
                  }} />
                ) : (
                  <div>No data</div>
                )}
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
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr><td colSpan="7">Loading…</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="7">No users found</td></tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td>{u.role || "user"}</td>
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
                  {loadingBookings ? (
                    <tr><td colSpan="7">Loading…</td></tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr><td colSpan="7">No bookings found</td></tr>
                  ) : filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.user_name || `#${b.userId}`}</td>
                      <td>{b.pet_name || b.petName}</td>
                      <td>{b.type || b.service}</td>
                      <td>
                        <select className="status" value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{b.day || b.date}</td>
                      <td className="actions">
                        <button className="btn view" onClick={() => openDetails(b)}>View</button>
                        <button className="btn danger" onClick={() => deleteBooking(b.id)}>Delete</button>
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
              <p><strong>User:</strong> {detailBooking.user_name || `#${detailBooking.userId}`}</p>
              <p><strong>Service:</strong> {detailBooking.type || detailBooking.service}</p>
              <p><strong>Pet:</strong> {detailBooking.pet_name || detailBooking.petName} — {detailBooking.petType || "-"}</p>
              <p><strong>Slot & Day:</strong> {detailBooking.slot || "-"} • {detailBooking.day || detailBooking.date || "-"}</p>
              <p><strong>Description:</strong><br/>{detailBooking.description || "-"}</p>
              <p><strong>Status:</strong> {detailBooking.status}</p>
              <p><strong>Created:</strong> {detailBooking.created_at || "-"}</p>
            </div>

            <footer className="modal-footer">
              <button className="btn" onClick={() => { updateStatus(detailBooking.id, "approved"); closeDetails(); }}>Approve</button>
              <button className="btn danger" onClick={() => { updateStatus(detailBooking.id, "cancelled"); closeDetails(); }}>Cancel Booking</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
