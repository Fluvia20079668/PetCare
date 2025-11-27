import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API_BASE = "http://localhost:8080/api/admin";
const BOOKING_TYPES = ["daycare", "hostel"]; 

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
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
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const usersRes = await fetch(`${API_BASE}/users`).then((r) => r.json());
      setUsers(usersRes.status === "success" ? usersRes.users : []);

      const bookingResults = await Promise.all(
        BOOKING_TYPES.map((type) =>
          fetch(`${API_BASE}/bookings/${type}`).then((r) =>
            r.json().catch(() => ({ status: "error" }))
          )
        )
      );

      const allBookings = [];
      bookingResults.forEach((res, index) => {
        const type = BOOKING_TYPES[index];
        if (res.status === "success" && Array.isArray(res.bookings)) {
          res.bookings.forEach((b) => allBookings.push({ ...b, type }));
        }
      });

      setBookings(allBookings);
    } catch {
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
      months.push({
        label: d.toLocaleString("default", { month: "short" }),
        key: `${d.getFullYear()}-${d.getMonth()}`,
      });
    }
    const counts = months.map(() => 0);

    bookings.forEach((b) => {
      if (!b.created_at) return;
      const d = new Date(b.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const idx = months.findIndex((m) => m.key === key);
      if (idx >= 0) counts[idx]++;
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

  function askConfirm(text, onConfirm) {
    setConfirmData({ text, onConfirm });
  }

  async function doDeleteUser(id) {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" }).then((r) =>
        r.json()
      );
      if (res.status === "success") {
        setUsers((u) => u.filter((x) => x.id !== id));
        showSaved("User deleted");
      } else alert(res.message);
    } catch {
      alert("Server error");
    }
  }

  async function doDeleteBooking(type, id) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${type}/${id}`, {
        method: "DELETE",
      }).then((r) => r.json());

      if (res.status === "success") {
        setBookings((b) => b.filter((bk) => !(bk.id === id && bk.type === type)));
        showSaved("Booking deleted");
      } else alert(res.message);
    } catch {
      alert("Server error");
    }
  }

  async function handleUpdateBookingStatus(type, id, status) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then((r) => r.json());

      if (res.status === "success") {
        setBookings((b) =>
          b.map((x) => (x.type === type && x.id === id ? { ...x, status } : x))
        );
        showSaved("Status updated");
      } else alert(res.message);
    } catch {
      alert("Server error");
    }
  }

  return (
    <div className="adm-wrap">
      {/* SIDEBAR */}
      <aside className="adm-sidebar">
        <div className="brand">
          <div className="logo">🐾</div>
          <div>
            <div className="brand-name">PetCare+</div>
            <div className="brand-sub">AdminDashboard</div>
          </div>
        </div>

        <div className="nav">
          <button
            className={activeTab === "overview" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "users" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "bookings" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </div>

        <div className="sidebar-footer">
          {/* FIXED — USE logout-btn FROM CSS */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Sign out
          </button>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={dark}
              onChange={(e) => setDark(e.target.checked)}
            />
            <span>Dark mode</span>
          </label>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="adm-main">
        <header className="adm-header">
          <div className="adm-search">
            <input
              placeholder="Search users, bookings, pets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="filter-row">
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
              >
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
                {/* OVERVIEW CARDS */}
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
                    <div className="card-value">
                      {bookings.filter((b) => b.status === "pending").length}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* USERS TABLE */}
            {activeTab === "users" && (
              <section className="table-section">
                <h2>Users ({filteredUsers.length})</h2>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role ${u.role}`}>{u.role}</span>
                          </td>
                          <td>{u.created_at}</td>
                          <td className="actions">
                            <button className="btn">Edit</button>
                            <button
                              className="btn danger"
                              onClick={() =>
                                askConfirm("Delete this user?", () =>
                                  doDeleteUser(u.id)
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* BOOKINGS TABLE */}
            {activeTab === "bookings" && (
              <section className="table-section">
                <h2>Bookings ({filteredBookings.length})</h2>

                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Pet</th>
                        <th>Pet Type</th>
                        <th>Slot</th>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
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
                          <td>
                            <span className={`status-badge ${b.status}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>{b.created_at}</td>

                          <td className="actions">
                            <button className="btn">Edit</button>
                            <button
                              className="btn"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  b.type,
                                  b.id,
                                  "approved"
                                )
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  b.type,
                                  b.id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>

                            <button
                              className="btn danger"
                              onClick={() =>
                                askConfirm("Delete booking?", () =>
                                  doDeleteBooking(b.type, b.id)
                                )
                              }
                            >
                              Delete
                            </button>
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

      {/* CONFIRM MODAL */}
      {confirmData && (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmData(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm</h3>
            <p>{confirmData.text}</p>

            <div className="modal-actions">
              <button
                className="btn danger"
                onClick={() => {
                  confirmData.onConfirm();
                  setConfirmData(null);
                }}
              >
                Yes
              </button>

              <button
                className="btn"
                onClick={() => setConfirmData(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
