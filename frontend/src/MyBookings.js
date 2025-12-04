import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "./utils/auth";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = getUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return; // Only fetch if logged in
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookings/user/${userId}`
        );

        // Handle both response shapes: array or { bookings: [...] }
        const data = response.data.bookings ?? response.data;
        setBookings(Array.isArray(data) ? data : []);
        console.log("Bookings fetched:", data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  // If user is not logged in
  if (!userId) {
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <p>Login to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

      {loading && <p className="loading-text">Loading bookings...</p>}

      {error && <p className="error-text">{error}</p>}

      {!loading && bookings.length === 0 && <p>No bookings found.</p>}

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
                <strong>Status:</strong> {b.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
