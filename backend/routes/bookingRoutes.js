const express = require("express");
const router = express.Router();
const db = require("../db");

/* ======================================================
   CREATE BOOKING  (USER SIDE)
====================================================== */
router.post("/", (req, res) => {
  const { 
    userId, serviceType, petName, petType, day,
    slot, description, ddate, checkoutDate, checkoutDay 
  } = req.body;

  if (!userId || !serviceType || !petName || !day) {
  return res.json({
    status: "error",
    message: "Missing required fields"
  });
}

// For non-hostel services, slot is required
if (serviceType !== "hostel" && !slot) {
  return res.json({
    status: "error",
    message: "Slot is required for this service"
  });
}


  const sql = `
    INSERT INTO bookings 
    (userId, serviceType, petName, petType, day, slot, ddate, checkoutDate, checkoutDay, status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `;


  db.query(
    sql,
    [
      userId, serviceType, petName, petType, day,
      slot || null, ddate || null, checkoutDate || null,
      checkoutDay || null, description || ""
    ],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.json({
          status: "error",
          message: "Failed to create booking",
        });
      }

      res.json({
        status: "success",
        message: "Booking created successfully",
        bookingId: result.insertId,
      });
    }
  );
});

/* ======================================================
   GET ALL BOOKINGS (ADMIN SIDE)
====================================================== */
router.get("/", (req, res) => {
  const sql = `
    SELECT 
  b.id,
  b.userId,
  u.name AS user_name,
  b.serviceType AS type,
  b.petName AS pet_name,
  b.petType,
  b.day,
  b.slot,
  b.ddate,
  b.checkoutDate,
  b.checkoutDay,
  b.status,
  b.created_at,
  b.description
   FROM bookings b
    LEFT JOIN users u ON b.userId = u.id
    ORDER BY b.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", bookings: result });
  });
});

/* ======================================================
   UPDATE BOOKING (ADMIN SIDE)
====================================================== */
router.put("/:id", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.json({
      status: "error",
      message: "Status is required",
    });
  }

  const sql = "UPDATE bookings SET status=? WHERE id=?";

  db.query(sql, [status, req.params.id], (err) => {
    if (err) {
      console.error("Update Error:", err);
      return res.json({ status: "error", error: err.message });
    }

    res.json({
      status: "success",
      message: "Booking status updated",
    });
  });
});

/* ======================================================
   USER: EDIT BOOKING
====================================================== */
router.put("/user/:id", (req, res) => {
  const { day, slot, description, ddate, checkoutDate, checkoutDay } = req.body;

  const sql = `
    UPDATE bookings
    SET day=?, slot=?, description=?
    WHERE id=?
  `;

  db.query(sql, [
  day,
  slot || null,
  description || "",
  ddate || null,
  checkoutDate || null,
  checkoutDay || null,
  req.params.id
], (err) => {
    if (err) {
      console.error("User Update Error:", err);
      return res.json({ status: "error", error: err.message });
    }

    res.json({
      status: "success",
      message: "Booking updated successfully",
    });
  });
});

/* ======================================================
   USER: CANCEL BOOKING
====================================================== */
router.delete("/user/:id", (req, res) => {
  const sql = "UPDATE bookings SET status='cancelled' WHERE id=?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });

    res.json({
      status: "success",
      message: "Booking cancelled",
    });
  });
});
/* ======================================================
   DELETE BOOKING (ADMIN SIDE)
====================================================== */
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM bookings WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "Booking deleted" });
  });
});

module.exports = router;
