const express = require("express");
const router = express.Router();
const db = require("../db");

// Create daycare booking
router.post("/book", (req, res) => {
  const { userId, name, petName, petType, slot, day, description } = req.body;

  if (!userId || !name || !petName || !petType || !slot || !day) {
    return res.json({ status: "fail", message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO daycare_booking 
    (user_id, name, pet_name, pet_type, slot, day, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, name, petName, petType, slot, day, description], (err, result) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({
      status: "success",
      bookingId: result.insertId
    });
  });
});

module.exports = router;
