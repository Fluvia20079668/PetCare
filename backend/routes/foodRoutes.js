const express = require("express");
const router = express.Router();
const db = require("../db");

// BOOK FOOD DELIVERY
router.post("/book", (req, res) => {
  const { userId, name, petName, petType, slot, day, description } = req.body;

  if (!userId || !slot || !day) {
    return res.json({ status: "fail", message: "Missing fields" });
  }

  const sql = `
    INSERT INTO food_bookings (userId, name, petName, petType, slot, day, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, name, petName, petType, slot, day, description], (err) => {
    if (err) return res.json({ status: "error", message: "DB error" });
    return res.json({ status: "success", message: "Food Delivery booked!" });
  });
});

module.exports = router;
