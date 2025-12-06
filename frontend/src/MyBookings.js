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
//---------------------------------------------------------------------//

if (!userId) {
    return <p>Login to view your bookings.</p>;
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && bookings.length === 0 && (
        <p className="no-bookings">No bookings found.</p>
      )}

     
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <h3>{b.serviceName}</h3>

            <p><strong>Pet:</strong> {b.petName}</p>
            <p><strong>Date:</strong> {b.day}</p>
            <p><strong>Time:</strong> {b.slot}</p>
            <p><strong>ServiceType:</strong> {b.serviceType}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </p>
              <button onClick={() => setEditBooking(b)}>Edit</button>
            <button onClick={() => handleCancel(b.id)} className="cancel-btn">
              Cancel
            </button>
            </div>
          ))}
          
        </div>
      
    </div>
  );
}
 {/* =====================================================
         EDIT MODAL
  ===================================================== */}
  {editBooking && (
  <div className="edit-modal-overlay">
    <div className="edit-modal">
      <h3>Edit Booking</h3>

      <label>Date</label>
      <input
        type="date"
        value={editBooking.day}
        onChange={(e) =>
          setEditBooking({ ...editBooking, day: e.target.value })
        }
      />

      <label>Time Slot</label>
      <input
        type="time"
        value={editBooking.slot}
        onChange={(e) =>
          setEditBooking({ ...editBooking, slot: e.target.value })
        }
      />

      <label>Description</label>
      <textarea
        value={editBooking.description}
        onChange={(e) =>
          setEditBooking({ ...editBooking, description: e.target.value })
        }
      />

      <div className="edit-buttons">
        <button className="save-btn" onClick={saveEdit}>Save</button>
        <button className="cancel-btn" onClick={() => setEditBooking(null)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}
