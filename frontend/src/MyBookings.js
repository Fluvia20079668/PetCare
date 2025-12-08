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
  const userId = user?._id || user?.id;

//fetches a user's bookings details from API
  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:8080/users/user/${userId}`);

         // Map id → _id for frontend consistency
        const bookingsData = res.data.map(b => ({ ...b, _id: b.id }));
        setBookings(bookingsData);

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

try{
    await axios.delete(`http://localhost:8080/book/user/${id}`);

    setBookings(
      bookings.map(b =>
      b._id === id ? { ...b, status: "cancelled" } : b
    ));
  }
 catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking.");
    }
  };
//The user saveEdit function
const saveEdit = async () => {
  if (!editBooking) return;

   try {

    console.log("Saving edit booking ID:", editBooking._id, editBooking);

 await axios.put(
      `http://localhost:8080/book/user/${editBooking._id}`,
      {
        day: editBooking.day,
        slot: editBooking.slot,
        description: editBooking.description,
      }
    );


    setBookings(bookings.map(b =>
      b._id === editBooking._id ? editBooking : b
    ));

    setEditBooking(null);
  }catch (err) {
      console.error("Edit error:", err);
      alert("Failed to save changes.");
    }
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
              <h3>{b.serviceName || b.type}</h3>

            <p><strong>Pet:</strong> {b.petName}</p>
            <p><strong>Date:</strong> {b.day}</p>
            <p><strong>Time:</strong> {b.slot}</p>
            <p><strong>ServiceType:</strong> {b.serviceType}</p>
            <p><strong>Description</strong> {b.description}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </p>
              <button onClick={() => setEditBooking(b)}>Edit</button>
            <button onClick={() => handleCancel(b._id)} className="cancel-btn">
            Cancel
            </button>

            </div>
          ))}
          
        </div>
      
    
 {/* =====================================================
         EDIT MODAL
  ===================================================== */}
  {editBooking && (
  <div className="modal">
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

      <label>Slot</label>
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

      <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditBooking(null)}>Close</button>
      </div>
    </div>
  
)}

</div>
  );
}