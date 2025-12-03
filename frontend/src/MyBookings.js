import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "./utils/auth";


export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // Get logged-in user details
  const user = getUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookings/user/${userId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookings();
    else setLoading(false);
  }, [userId]);

  if (!userId)
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <p>You must be logged in to view your bookings.</p>
      </div>
    );
if (loading) return <p className="loading-text">Loading bookings...</p>;
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
