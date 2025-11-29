const express = require("express");
const router = express.Router();
const db = require("../db");

// Create booking
router.post("/", (req, res) => {
  const { userId, serviceType, name, petName, petType, slot, day, description } = req.body;

  if (!userId || !serviceType) {
    return res.json({ status: "fail", message: "Missing fields" });
  }

  const sql = `
    INSERT INTO bookings (userId, serviceType, name, petName, petType, slot, day, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, serviceType, name, petName, petType, slot, day, description], (err) => {
    if (err) return res.json({ status: "error", message: "Database error" });
    return res.json({ status: "success", message: "Booking successful!" });
  });
});

module.exports = router;
