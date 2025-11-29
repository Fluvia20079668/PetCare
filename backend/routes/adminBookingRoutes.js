const express = require("express");
const router = express.Router();
const db = require("../db");

// ADMIN — Get all bookings
router.get("/bookings", (req, res) => {
  const sql = "SELECT * FROM bookings ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.json({ status: "error", message: "Database error" });
    }
    return res.json({ status: "success", bookings: results });
  });
});

module.exports = router;
