const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all users
router.get("/users", (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users", (err, results) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success", users: results });
  });
});

// Delete a user (and their bookings via FK cascade if configured)
router.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success" });
  });
});

// Get all bookings (daycare + hostel) with user name and type
router.get("/bookings", (req, res) => {
  const sql = `
    SELECT d.id, d.user_id, u.name AS user_name, d.name AS customer_name, d.pet_name, d.pet_type, d.slot, d.day, d.description, d.status, d.created_at, 'daycare' AS type
      FROM daycare_booking d
      JOIN users u ON d.user_id = u.id
    UNION ALL
    SELECT h.id, h.user_id, u2.name AS user_name, h.name AS customer_name, h.pet_name, h.pet_type, h.slot, h.day, h.description, h.status, h.created_at, 'hostel' AS type
      FROM hostel_booking h
      JOIN users u2 ON h.user_id = u2.id
    ORDER BY created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success", bookings: results });
  });
});

// Update booking status (approve/reject/pending/completed)
router.put("/bookings/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const { status } = req.body;
  const table = type === "daycare" ? "daycare_booking" : type === "hostel" ? "hostel_booking" : null;
  if (!table) return res.json({ status: "fail", message: "Invalid booking type" });
  db.query(`UPDATE ${table} SET status = ? WHERE id = ?`, [status, id], (err) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success" });
  });
});

// Delete a booking
router.delete("/bookings/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const table = type === "daycare" ? "daycare_booking" : type === "hostel" ? "hostel_booking" : null;
  if (!table) return res.json({ status: "fail", message: "Invalid booking type" });
  db.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success" });
  });
});

module.exports = router;
