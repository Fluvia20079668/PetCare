const express = require("express");
const router = express.Router();
const db = require("../db");

// Cancel a booking
router.put("/cancel/:id", (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE bookings SET status='cancelled' WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.json({ status: "error", message: "Database error" });
    }

    return res.json({ status: "success", message: "Booking cancelled" });
  });
});

module.exports = router;
