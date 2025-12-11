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
  const { day, slot, description} = req.body;

  const sql = `
    UPDATE bookings
    SET day=?, slot=?, description=?
    WHERE id=?
  `;

  db.query(sql, [
  day,
  slot || null,
  description || "",
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
   USER: EDIT HOSTEL CHECKOUT DATE

====================================================== */
router.put("/user/checkout/:id", (req, res) => {
  const { checkoutDate, description } = req.body;

  console.log("Incoming checkout update:", {
    checkoutDate,
    description,
    id: req.params.id
  });

  const sql = `
    UPDATE bookings
    SET checkoutDate=?, description=?
    WHERE id=?
  `;

  db.query(
    sql,
    [checkoutDate || null, description || "", req.params.id],
    (err, result) => {
      if (err) {
        console.error("Checkout Update Error:", err);
        return res.json({ status: "error", error: err.sqlMessage });
      }

      console.log("MySQL update result:", result);

      if (result.affectedRows === 0) {
        return res.json({
          status: "error",
          message: "No booking found for this ID",
        });
      }

      res.json({ status: "success", message: "Checkout updated" });
    }
  );
});
/* ======================================================
   USER: UPDATE HOSTEL CHECKOUT DATE AND DAY

====================================================== */
router.put("user/checkout/:id",(req, res) => {

  const { checkoutDate, description } = req.body;

  {
    const sql = `
      UPDATE bookings
      SET checkoutDate = ?, description = ?
      WHERE id = ?
    `;

    db.query(
    sql,
    [checkoutDate || null, description || "", req.params.id],
    (err, result) => {
      if (err) {
        console.error("Checkout update error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json({ message: "Checkout updated successfully" });
    });
  } 
  }
);

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
