import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assuming you save logged-in user ID in localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bookings/user/${userId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookings();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <h3>{b.serviceName}</h3>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Status:</strong> {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
