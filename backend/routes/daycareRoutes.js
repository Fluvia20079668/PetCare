const express = require("express");
const router = express.Router();
const db = require("../db");

/* -------------------------
   CREATE DAYCARE BOOKING
-------------------------- */
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

/* -------------------------
   GET ALL DAYCARE BOOKINGS
-------------------------- */
router.get("/all", (req, res) => {
  const sql = "SELECT * FROM daycare_booking ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({
      status: "success",
      data: result
    });
  });
});

module.exports = router;
