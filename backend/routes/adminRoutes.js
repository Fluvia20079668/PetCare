// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // your mysql connection
const adminAuth = require("../middleware/adminAuth"); // optional, see file below

// TEST
router.get("/test", (req, res) => {
  res.json({ status: "success", message: "Admin route working" });
});

// GET ALL USERS
router.get("/users" /*, adminAuth */, (req, res) => {
  db.query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC", (err, result) => {
    if (err) return res.json({ status: "error", error: err.message || err });
    res.json({ status: "success", users: result });
  });
});

// DELETE USER
router.delete("/users/:id" /*, adminAuth */, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.json({ status: "error", error: err.message || err });
    res.json({ status: "success", message: "User deleted" });
  });
});

// GET ALL BOOKINGS (joined with users to provide user_name)
router.get("/bookings" /*, adminAuth */, (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.userId,
      u.name AS user_name,
      b.service AS type,
      b.petName AS pet_name,
      b.date AS day,
      b.slot,
      b.status,
      b.created_at,
      b.description
    FROM all_bookings b
    LEFT JOIN users u ON b.userId = u.id
    ORDER BY b.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ status: "error", error: err.message || err });
    res.json({ status: "success", bookings: result });
  });
});

// DELETE BOOKING
router.delete("/bookings/:id" /*, adminAuth */, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM all_bookings WHERE id = ?", [id], (err, result) => {
    if (err) return res.json({ status: "error", error: err.message || err });
    res.json({ status: "success", message: "Booking deleted" });
  });
});

// UPDATE BOOKING STATUS / other fields
router.put("/bookings/:id" /*, adminAuth */, (req, res) => {
  const id = req.params.id;
  const { status, service, petName, date, slot, description } = req.body;

  // Build simple dynamic update for provided fields
  const fields = [];
  const values = [];

  if (typeof status !== "undefined") {
    fields.push("status = ?");
    values.push(status);
  }
  if (typeof service !== "undefined") {
    fields.push("service = ?");
    values.push(service);
  }
  if (typeof petName !== "undefined") {
    fields.push("petName = ?");
    values.push(petName);
  }
  if (typeof date !== "undefined") {
    fields.push("date = ?");
    values.push(date);
  }
  if (typeof slot !== "undefined") {
    fields.push("slot = ?");
    values.push(slot);
  }
  if (typeof description !== "undefined") {
    fields.push("description = ?");
    values.push(description);
  }

  if (fields.length === 0) {
    return res.json({ status: "error", error: "No fields provided to update" });
  }

  const sql = `UPDATE all_bookings SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ status: "error", error: err.message || err });
    res.json({ status: "success", message: "Booking updated" });
  });
});

module.exports = router;
