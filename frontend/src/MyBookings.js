import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyBookings.css";
import { getUser } from "./utils/auth";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editBooking, setEditBooking] = useState(null);//user can edit the Booking
  const [editCheckout, setEditCheckout] = useState(null);

  const user = getUser();
  const userId = user?._id || user?.id;



//fetches a user's bookings details from API

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      

      try {
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/user/${userId}`);


         // Map id → _id for frontend consistency
        const bookingsData = res.data.map((b) => ({ ...b, _id: b._id || b.id }));
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
    await axios.delete(`${process.env.REACT_APP_API_URL}/book/user/${id}`);

    setBookings(
      bookings.map((b) =>

          b._id === id ? { ...b, status: "cancelled" } : b

        )

      );
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

   // console.log("Saving edit booking ID:", editBooking._id, editBooking);

 await axios.put(
      `${process.env.REACT_APP_API_URL}/book/user/${editBooking._id}`,
      {
        ddate: new Date(editBooking.ddate).toISOString().split("T")[0], 
        slot: editBooking.slot,
        description: editBooking.description,
      }
    );


    setBookings(bookings.map((b) =>
  b._id === editBooking._id
    ? { ...b, ddate: editBooking.ddate, slot: editBooking.slot, description: editBooking.description }
    : b
));


    setEditBooking(null);
  }catch (err) {
      console.error("Edit error:", err);
      alert("Failed to save changes.");
    }
  };
  /*--------------------Save Checkout Edit---------------------------*/
  const saveCheckoutEdit = async () => {
    if (!editCheckout) return;

  console.log("Sending", editCheckout);

    try {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/book/user/checkout/${editCheckout._id}`,
        {
          checkoutDate: editCheckout.checkoutDate,
          description: editCheckout.description,
        }
      );

      console.log("Server response:", res.data);

      setBookings(
        bookings.map((b) =>
          b._id === editCheckout._id
            ? {
                ...b,
                checkoutDate: editCheckout.checkoutDate,
                description: editCheckout.description,
              }
            : b
        )
      );

      setEditCheckout(null);
    } catch (err) {
      console.error("Checkout edit error:", err.response?.data || err.message);
      alert("Failed to save checkout changes.");
    }
  };

//----------------------RENDER-----------------------------------------------//

  if (!userId) {
    return <p>Login to view your bookings.</p>;
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

       {loading && <p className="loading-text">Loading bookings...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && bookings.length === 0 && (
        <p className="no-bookings">No bookings found.</p>
      )}
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <h3>{b.serviceName}</h3>

            <p><strong>Pet Name:</strong> {b.petName}</p>
            <p><strong>Pet Type:</strong> {b.petType}</p>
             <p><strong>ServiceType:</strong> {b.serviceType}</p>
            {b.ddate && (
              <p>
                <strong>Check-In:</strong>
                {new Date(b.ddate).toLocaleDateString()}
              </p>
            )}
            {b.serviceType === "hostel" && b.checkoutDate && (
              <p>
                <strong>Check-Out:</strong>
                {new Date(b.checkoutDate).toLocaleDateString()}
              </p>
            )}
            <p><strong>Time:</strong> {b.slot}</p>
            <p><strong>Description</strong> {b.description}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </p>
            
              <button onClick={() => setEditBooking(b)}>Edit</button>
              {b.serviceType === "hostel" && (
              //ADDED CHECKOUT EDIT BUTTON ONLY FOR PETHOSTEL 
              <button
                className="edit-checkout-btn"
                onClick={() =>
                setEditCheckout({
                  _id: b._id,
                   checkoutDate: b.checkoutDate
                    ? new Date(b.checkoutDate).toISOString().split("T")[0]
                        : "",
                      description: b.description,
                        })
                        }

               
              >
                Edit Checkout
              </button>
            )}
            <button onClick={() => handleCancel(b._id)} className="cancel-btn">
            Cancel
            </button>

            </div>
          ))}
          
        </div>
{/* =====================================================
         EDIT BOOKING MODAL
===================================================== */}
{editBooking && (
  <div className="modal">
    <div className="edit-modal">
      <h3>Edit Booking</h3>

      <label>Day</label>
      <input
        type="date"
        value={editBooking.ddate ? new Date(editBooking.ddate).toISOString().split("T")[0] : ""}
        onChange={(e) =>
          setEditBooking({ ...editBooking, ddate: e.target.value })
        }
      />

      <label>Time Slot</label>
      <select
        value={editBooking.slot || ""}
        onChange={(e) =>
          setEditBooking({ ...editBooking, slot: e.target.value })
        }
      >
        <option value="">Select slot</option>
        <option value="9:00 AM">9:00 AM</option>
        <option value="10:00 AM">10:00 AM</option>
        <option value="11:00 AM">11:00 AM</option>
        <option value="1:00 PM">1:00 PM</option>
        <option value="2:00 PM">2:00 PM</option>
      </select>

      <label>Description</label>
      <textarea
        value={editBooking.description || ""}
        onChange={(e) =>
          setEditBooking({ ...editBooking, description: e.target.value })
        }
      />

      <button onClick={saveEdit}>Save</button>
      <button onClick={() => setEditBooking(null)}>Close</button>
    </div>
  </div>
)}

{/* =====================================================
      EDIT CHECKOUT MODAL
===================================================== */}
{editCheckout && (
  <div className="modal">
    <div className="edit-modal">
      <h3>Edit Checkout</h3>

      <label>Checkout Date</label>
      <input
        type="date"
        value={editCheckout.checkoutDate || ""}
        onChange={(e) =>
          setEditCheckout({ ...editCheckout, checkoutDate: e.target.value })
        }
      />

      <label>Description</label>
      <textarea
        value={editCheckout.description || ""}
        onChange={(e) =>
          setEditCheckout({
            ...editCheckout,
            description: e.target.value,
          })
        }
      />

      <button onClick={saveCheckoutEdit}>Save</button>
      <button onClick={() => setEditCheckout(null)}>Close</button>
    </div>
  </div>
)}


  </div>
  );
}