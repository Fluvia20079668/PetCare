const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// TEST
// ======================
router.get("/test", (req, res) => {
  res.send("Admin route OK");
});

// ======================
// ADMIN LOGIN
// ======================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.json({ status: "error", error: err });

    if (result.length === 0) {
      return res.json({ status: "fail", message: "User not found" });
    }

    const admin = result[0];

    if (admin.role !== "admin") {
      return res.json({ status: "fail", message: "Not an admin" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ status: "fail", message: "Wrong password" });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      status: "success",
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  });
});

// ======================
// GET ALL USERS
// ======================
router.get("/users", (req, res) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users",
    (err, result) => {
      if (err) return res.json({ status: "error", error: err });

      res.json({
        status: "success",
        users: result
      });
    }
  );
});

// ======================
// DELETE USER
// ======================
router.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({ status: "success", message: "User deleted" });
  });
});

// ======================
// GET ALL BOOKINGS
// ======================
router.get("/bookings", (req, res) => {
  const sql = `
    SELECT 
      bookings.id,
      bookings.userId,
      bookings.name AS user_name,
      bookings.petName AS pet_name,
      bookings.petType,
      bookings.slot,
      bookings.day,
      bookings.serviceType AS type,
      bookings.description,
      bookings.status
    FROM bookings
    ORDER BY bookings.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({
      status: "success",
      bookings: result
    });
  });
});

// ======================
// UPDATE BOOKING STATUS
// ======================
router.put("/bookings/:type/:id", (req, res) => {
  const { status } = req.body;

  db.query("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({ status: "success", message: "Status updated" });
  });
});

// ======================
// DELETE BOOKING
// ======================
router.delete("/bookings/:type/:id", (req, res) => {
  db.query("DELETE FROM bookings WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({ status: "success", message: "Booking deleted" });
  });
});

module.exports = router;
