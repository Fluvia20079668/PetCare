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
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", bookings: result });
  });
});

// UPDATE BOOKING
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { status, service, petName, date, slot, description } = req.body;

  const fields = [];
  const values = [];

  if (status !== undefined) { fields.push("status = ?"); values.push(status); }
  if (service !== undefined) { fields.push("service = ?"); values.push(service); }
  if (petName !== undefined) { fields.push("petName = ?"); values.push(petName); }
  if (date !== undefined) { fields.push("date = ?"); values.push(date); }
  if (slot !== undefined) { fields.push("slot = ?"); values.push(slot); }
  if (description !== undefined) { fields.push("description = ?"); values.push(description); }

  if (fields.length === 0) {
    return res.json({ status: "error", error: "No fields provided" });
  }

  const sql = `UPDATE all_bookings SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "Booking updated" });
  });
});

// DELETE BOOKING
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM all_bookings WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "Booking deleted" });
  });
});

module.exports = router;
