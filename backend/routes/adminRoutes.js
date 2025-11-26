const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all users
router.get("/users", (req, res) => {
  db.query("SELECT id, name, email, created_at FROM users", (err, results) => {
    if (err) return res.json({ status: "error" });
    res.json({ status: "success", users: results });
  });
});

// Get all daycare bookings
router.get("/daycare", (req, res) => {
  db.query(
    "SELECT d.id, u.name AS user_name, d.pet_name, d.pet_type, d.date, d.description, d.created_at FROM daycare_booking d JOIN users u ON d.user_id = u.id",
    (err, results) => {
      if (err) return res.json({ status: "error" });
      res.json({ status: "success", bookings: results });
    }
  );
});

// Get all hostel bookings
router.get("/hostel", (req, res) => {
  db.query(
    "SELECT h.id, u.name AS user_name, h.pet_name, h.pet_type, h.date, h.description, h.created_at FROM hostel_booking h JOIN users u ON h.user_id = u.id",
    (err, results) => {
      if (err) return res.json({ status: "error" });
      res.json({ status: "success", bookings: results });
    }
  );
});

module.exports = router;
