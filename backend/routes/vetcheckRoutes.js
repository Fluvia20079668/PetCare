const express = require("express");
const router = express.Router();
const db = require("../db");

// BOOK VET CHECK
router.post("/book", (req, res) => {
  const { userId, name, petName, petType, slot, day, description } = req.body;

  if (!userId || !petName || !slot || !day) {
    return res.json({ status: "fail", message: "Missing fields" });
  }

  const sql = `
    INSERT INTO vetcheck_bookings (userId, name, petName, petType, slot, day, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, name, petName, petType, slot, day, description], (err) => {
    if (err) return res.json({ status: "error", message: "DB error" });
    return res.json({ status: "success", message: "Vet check booked!" });
  });
});

module.exports = router;
