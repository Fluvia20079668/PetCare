const express = require("express");
const router = express.Router();
const db = require("../db");

// Get bookings by user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT * FROM bookings WHERE userId = ? ORDER BY created_at DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.json({ status: "error", message: "Database error" });
    }
    return res.json({ status: "success", bookings: results });
  });
});

module.exports = router;
