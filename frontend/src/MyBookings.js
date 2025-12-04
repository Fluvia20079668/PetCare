import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "./utils/auth";


export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Get logged-in user details
  const user = getUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookings/user/${userId}`
        );
        console.log("Bookings fetched:", response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) 
      {
      fetchBookings();
      }
    else 
      {
        setLoading(false);
      } 
  }, [userId]);
// If user is not logged in
  if (!userId)
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <p>login to view your bookings.</p>
      </div>
    );

    // Loading state
 if (loading) {
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <p className="loading-text">Loading bookings...</p>
      </div>
    );
  }
   return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

      {error && <p className="error-text">{error}</p>}

      {!bookings || bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <h3>{b.serviceName}</h3>
              <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p><strong>Status:</strong> {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
