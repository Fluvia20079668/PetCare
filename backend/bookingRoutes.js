const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { userId, serviceType, petName, petType, slot, day, description } = req.body;

  let table =
    serviceType === "daycare"
      ? "daycare_booking"
      : serviceType === "hostel"
      ? "hostel_booking"
      : null;

  if (!table)
    return res.json({ status: "fail", message: "Invalid service type" });

  db.query(
    `INSERT INTO ${table} (user_id, pet_name, pet_type, slot, day, description) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, petName, petType, slot, day, description],
    (err) => {
      if (err) return res.json({ status: "error" });
      res.json({ status: "success", message: "Booking saved" });
    }
  );
});

module.exports = router;
