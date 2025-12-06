import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyBookings.css";
import { getUser } from "./utils/auth";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editBooking, setEditBooking] = useState(null);//user can edit the Booking
  const user = getUser();
  const userId = user?.id;
//fetches a user's bookings details from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:8080/users/user/${userId}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

//The user can cancel for Booking
const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    await axios.delete(`http://localhost:8080/bookings/user/${id}`);

    setBookings(bookings.map(b =>
      b.id === id ? { ...b, status: "cancelled" } : b
    ));
  };

//The user can edit Booking
const saveEdit = async () => {
    await axios.put(
      `http://localhost:8080/bookings/user/${editBooking.id}`,
      {
        day: editBooking.day,
        slot: editBooking.slot,
        description: editBooking.description,
      }
    );

    setBookings(bookings.map(b =>
      b.id === editBooking.id ? editBooking : b
    ));

    setEditBooking(null);
  };

  if (!userId) {
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <p className="no-bookings">Login to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

      {loading && <p className="loading-text">Loading bookings...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && bookings.length === 0 && (
        <p className="no-bookings">No bookings found.</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <h3>{b.serviceName}</h3>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(b.date).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {new Date(b.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
