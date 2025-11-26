import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [daycare, setDaycare] = useState([]);
  const [hostel, setHostel] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data.users || []));

    fetch("http://localhost:8080/api/admin/daycare")
      .then(res => res.json())
      .then(data => setDaycare(data.bookings || []));

    fetch("http://localhost:8080/api/admin/hostel")
      .then(res => res.json())
      .then(data => setHostel(data.bookings || []));
  }, []);

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <button className="back-btn" onClick={() => navigate("/")}>← Back to Home</button>

      <section>
        <h2>Users</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Daycare Bookings</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>User</th><th>Pet</th><th>Type</th><th>Date</th><th>Description</th></tr>
          </thead>
          <tbody>
            {daycare.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.user_name}</td><td>{b.pet_name}</td><td>{b.pet_type}</td><td>{b.date}</td><td>{b.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Hostel Bookings</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>User</th><th>Pet</th><th>Type</th><th>Date</th><th>Description</th></tr>
          </thead>
          <tbody>
            {hostel.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.user_name}</td><td>{b.pet_name}</td><td>{b.pet_type}</td><td>{b.date}</td><td>{b.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
