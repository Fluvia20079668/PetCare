import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API_BASE = "http://localhost:8080/api/admin";
const BOOKING_TYPES = ["daycare", "hostel"]; // add other booking table types here if you have them

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | users | bookings
  const [query, setQuery] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all"); // all / pending / approved / rejected / completed
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [savedMsg, setSavedMsg] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("admin_dark") === "1");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("admin_dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const usersRes = await fetch(`${API_BASE}/users`).then((r) => r.json());
      if (usersRes.status === "success") setUsers(usersRes.users || []);
      else setUsers([]);

      // Fetch bookings from multiple tables and unify them
      const bookingPromises = BOOKING_TYPES.map((type) =>
        fetch(`${API_BASE}/bookings/${type}`).then((r) => r.json().catch(() => ({ status: "error" })))
      );

      const bookingResults = await Promise.all(bookingPromises);
      const allBookings = [];

      bookingResults.forEach((res, idx) => {
        const type = BOOKING_TYPES[idx];
        if (res && res.status === "success" && Array.isArray(res.bookings)) {
          res.bookings.forEach((b) => allBookings.push({ ...b, type }));
        }
      });

      setBookings(allBookings);
    } catch (err) {
      console.error("Failed to load admin data", err);
      alert("Failed to load admin data. Check server.");
    } finally {
      setLoading(false);
    }
  }

  const analytics = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleString("default", { month: "short" }), key: `${d.getFullYear()}-${d.getMonth()}` });
    }
    const counts = months.map(() => 0);
    bookings.forEach((b) => {
      if (!b.created_at) return;
      const d = new Date(b.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const idx = months.findIndex((m) => m.key === key);
      if (idx >= 0) counts[idx] = counts[idx] + 1;
    });
    return { months: months.map((m) => m.label), counts };
  }, [bookings]);

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [users, query]);

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => (bookingFilter === "all" ? true : b.status === bookingFilter))
      .filter((b) => {
        if (!q) return true;
        return (
          (b.user_name || "").toLowerCase().includes(q) ||
          (b.pet_name || "").toLowerCase().includes(q) ||
          (b.type || "").toLowerCase().includes(q)
        );
      });
  }, [bookings, bookingFilter, query]);

  function showSaved(msg) {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2500);
  }

  // Confirm helpers (replaces window.confirm)
  function askConfirm(text, onConfirm) {
    setConfirmData({ text, onConfirm });
  }

  async function doDeleteUser(id) {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" }).then((r) => r.json());
      if (res.status === "success") {
        setUsers((u) => u.filter((x) => x.id !== id));
        showSaved("User deleted");
      } else {
        alert(res.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  async function doDeleteBooking(type, id) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${type}/${id}`, { method: "DELETE" }).then((r) => r.json());
      if (res.status === "success") {
        setBookings((b) => b.filter((x) => !(x.type === type && x.id === id)));
        showSaved("Booking deleted");
      } else {
        alert(res.message || "Failed to delete booking");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  function handleDeleteUser(id) {
    askConfirm("Delete this user? This will remove their bookings if cascade is enabled.", () => doDeleteUser(id));
  }

  function handleDeleteBooking(type, id) {
    askConfirm("Delete this booking?", () => doDeleteBooking(type, id));
  }

  async function handleUpdateBookingStatus(type, id, status) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then((r) => r.json());
      if (res.status === "success") {
        setBookings((b) => b.map((x) => (x.type === type && x.id === id ? { ...x, status } : x)));
        showSaved("Status updated");
      } else {
        alert(res.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  function openEditUser(u) {
    setSelectedUser({ ...u });
  }
  function closeEditUser() {
    setSelectedUser(null);
  }

  async function saveUserEdits() {
    if (!selectedUser) return;
    try {
      const res = await fetch(`${API_BASE}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedUser.name, role: selectedUser.role }),
      }).then((r) => r.json());
      if (res.status === "success") {
        setUsers((u) => u.map((x) => (x.id === selectedUser.id ? { ...x, name: selectedUser.name, role: selectedUser.role } : x)));
        showSaved("User updated");
        closeEditUser();
      } else {
        alert(res.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  function openEditBooking(b) {
    setSelectedBooking({ ...b });
  }
  function closeEditBooking() {
    setSelectedBooking(null);
  }

  async function saveBookingEdits() {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${selectedBooking.type}/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet_name: selectedBooking.pet_name,
          pet_type: selectedBooking.pet_type,
          slot: selectedBooking.slot,
          day: selectedBooking.day,
          description: selectedBooking.description,
          status: selectedBooking.status,
        }),
      }).then((r) => r.json());
      if (res.status === "success") {
        setBookings((b) => b.map((x) => (x.type === selectedBooking.type && x.id === selectedBooking.id ? { ...x, ...selectedBooking } : x)));
        showSaved("Booking updated");
        closeEditBooking();
      } else {
        alert(res.message || "Failed to update booking");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  function TinyBar({ values = [], color = "#ff6a00", height = 40, width = 120 }) {
    if (!values.length) return null;
    const max = Math.max(...values, 1);
    return (
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="tiny-chart">
        {values.map((v, i) => {
          const barW = width / values.length;
          const h = (v / max) * (height - 6);
          return (
            <rect
              key={i}
              x={i * barW + barW * 0.12}
              y={height - h - 2}
              width={barW * 0.76}
              height={h}
              rx="2"
              fill={color}
              opacity={0.95}
            />
          );
        })}
      </svg>
    );
  }

  return (
    <div className="adm-wrap">
      <aside className="adm-sidebar">
        <div className="brand">
          <div className="logo">🐾</div>
          <div>
            <div className="brand-name">PetCare+</div>
            <div className="brand-sub">AdminDashboard</div>
          </div>
        </div>

        <div className="nav">
          <button className={activeTab === "overview" ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab("overview")}>Overview</button>
          <button className={activeTab === "users" ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab("users")}>Users</button>
          <button className={activeTab === "bookings" ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab("bookings")}>Bookings</button>
        </div>

        <div className="sidebar-footer">
          <label className="switch-row">
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
            <span>Dark mode</span>
          </label>
          <button
            className="signout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-header">
          <div className="adm-search">
            <input placeholder="Search users, bookings, pets..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="filter-row">
              <select value={bookingFilter} onChange={(e) => setBookingFilter(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="status-msg">{savedMsg}</div>
        </header>

        {loading ? (
          <div className="loading">Loading admin data…</div>
        ) : (
          <>
            {activeTab === "overview" && (
              <>
                <section className="cards">
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
                    <div className="card-value">{bookings.filter((b) => b.status === "pending").length}</div>
                  </div>
                </section>

                <section className="analytics">
                  <div className="analytics-left">
                    <h3>Bookings (last 6 months)</h3>
                    <TinyBar values={analytics.counts} />
                    <div className="analytics-labels">{analytics.months.map((m, i) => <span key={i}>{m}</span>)}</div>
                  </div>

                  <div className="analytics-right">
                    <h3>Bookings by status</h3>
                    <div className="status-list">
                      {["pending","approved","rejected","completed"].map((s) => {
                        const n = bookings.filter((b) => b.status === s).length;
                        return (
                          <div key={s} className="status-item">
                            <div className={`dot ${s}`}></div>
                            <div className="label">{s}</div>
                            <div className="count">{n}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "users" && (
              <section className="table-section">
                <h2>Users ({filteredUsers.length})</h2>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className={`role ${u.role}`}>{u.role}</span></td>
                          <td>{u.created_at}</td>
                          <td className="actions">
                            <button className="btn" onClick={() => openEditUser(u)}>Edit</button>
                            <button className="btn danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === "bookings" && (
              <section className="table-section">
                <h2>Bookings ({filteredBookings.length})</h2>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Type</th><th>User</th><th>Pet</th><th>Pet Type</th><th>Slot</th><th>Day</th><th>Status</th><th>Created</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={`${b.type}-${b.id}`}>
                          <td>{b.id}</td>
                          <td>{b.type}</td>
                          <td>{b.user_name}</td>
                          <td>{b.pet_name}</td>
                          <td>{b.pet_type}</td>
                          <td>{b.slot}</td>
                          <td>{b.day}</td>
                          <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                          <td>{b.created_at}</td>
                          <td className="actions">
                            <button className="btn" onClick={() => openEditBooking(b)}>Edit</button>
                            <button className="btn" onClick={() => handleUpdateBookingStatus(b.type, b.id, "approved")}>Approve</button>
                            <button className="btn" onClick={() => handleUpdateBookingStatus(b.type, b.id, "rejected")}>Reject</button>
                            <button className="btn danger" onClick={() => handleDeleteBooking(b.type, b.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={closeEditUser}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit User</h3>
            <label>Name</label>
            <input value={selectedUser.name} onChange={(e) => setSelectedUser((s) => ({ ...s, name: e.target.value }))} />
            <label>Role</label>
            <select value={selectedUser.role} onChange={(e) => setSelectedUser((s) => ({ ...s, role: e.target.value }))}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <div className="modal-actions">
              <button className="btn" onClick={saveUserEdits}>Save</button>
              <button className="btn" onClick={closeEditUser}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {selectedBooking && (
        <div className="modal-backdrop" onClick={closeEditBooking}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Booking</h3>
            <label>Pet Name</label>
            <input value={selectedBooking.pet_name || ""} onChange={(e) => setSelectedBooking((s) => ({ ...s, pet_name: e.target.value }))} />
            <label>Pet Type</label>
            <input value={selectedBooking.pet_type || ""} onChange={(e) => setSelectedBooking((s) => ({ ...s, pet_type: e.target.value }))} />
            <label>Slot</label>
            <input value={selectedBooking.slot || ""} onChange={(e) => setSelectedBooking((s) => ({ ...s, slot: e.target.value }))} />
            <label>Day</label>
            <input value={selectedBooking.day || ""} onChange={(e) => setSelectedBooking((s) => ({ ...s, day: e.target.value }))} />
            <label>Status</label>
            <select value={selectedBooking.status || "pending"} onChange={(e) => setSelectedBooking((s) => ({ ...s, status: e.target.value }))}>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="completed">completed</option>
            </select>
            <label>Description</label>
            <textarea value={selectedBooking.description || ""} onChange={(e) => setSelectedBooking((s) => ({ ...s, description: e.target.value }))} />
            <div className="modal-actions">
              <button className="btn" onClick={saveBookingEdits}>Save</button>
              <button className="btn" onClick={closeEditBooking}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmData && (
        <div className="modal-backdrop" onClick={() => setConfirmData(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm</h3>
            <p>{confirmData.text}</p>
            <div className="modal-actions">
              <button
                className="btn danger"
                onClick={() => {
                  try {
                    confirmData.onConfirm();
                  } finally {
                    setConfirmData(null);
                  }
                }}
              >
                Yes
              </button>
              <button className="btn" onClick={() => setConfirmData(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
