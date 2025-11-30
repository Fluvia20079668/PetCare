const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL BOOKINGS (JOIN users)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.userId,
      u.name AS user_name,
      b.serviceType AS type,
      b.petName AS pet_name,
      b.day,
      b.slot,
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

// UPDATE BOOKING
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { status, serviceType, petName, day, slot, description } = req.body;

  const sql = `
    UPDATE bookings 
    SET status=?, serviceType=?, petName=?, day=?, slot=?, description=?
    WHERE id=?
  `;

  db.query(sql, [status, serviceType, petName, day, slot, description, id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "Booking updated" });
  });
});

// DELETE BOOKING
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM bookings WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "Booking deleted" });
  });
});

module.exports = router;
