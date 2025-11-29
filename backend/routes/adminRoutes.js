const express = require("express");
const router = express.Router();
const db = require("../db");

// TEST
router.get("/test", (req, res) => {
  res.send("Admin route working");
});

// GET ALL USERS
router.get("/users", (req, res) => {
  db.query("SELECT id, name, email, phone FROM users", (err, result) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success", users: result });
  });
});

// GET ALL BOOKINGS (daycare, hostel, grooming, walking, etc.)
router.get("/bookings", (req, res) => {
  const sql = `
    SELECT id, userId, service, petName, date, slot, status
    FROM all_bookings
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success", bookings: result });
  });
});

// CANCEL BOOKING
router.put("/cancel/:id", (req, res) => {
  const bookingId = req.params.id;

  db.query(
    "UPDATE all_bookings SET status = 'cancelled' WHERE id = ?",
    [bookingId],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err });
      res.json({ status: "success", message: "Booking cancelled" });
    }
  );
});

module.exports = router;
