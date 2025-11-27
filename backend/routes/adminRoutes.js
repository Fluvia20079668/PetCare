const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// -----------------------------
//  ADMIN AUTH MIDDLEWARE
// -----------------------------
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.json({ status: "fail", message: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    if (decoded.role !== "admin") {
      return res.json({ status: "fail", message: "Not an admin" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.json({ status: "fail", message: "Invalid token" });
  }
}

// -----------------------------
//  GET ALL USERS
// -----------------------------
router.get("/users", verifyAdmin, (req, res) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC",
    (err, results) => {
      if (err) return res.json({ status: "error", error: err });
      res.json({ status: "success", users: results });
    }
  );
});

// -----------------------------
//  DELETE USER
// -----------------------------
router.delete("/users/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.json({ status: "error", error: err });

    res.json({ status: "success", message: "User deleted" });
  });
});

// -----------------------------
//  UPDATE USER (role, name, etc.)
// -----------------------------
router.put("/users/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  db.query(
    "UPDATE users SET name = ?, role = ? WHERE id = ?",
    [name, role, id],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err });
      res.json({ status: "success", message: "User updated" });
    }
  );
});

// ==========================================================
//       BOOKING ROUTES (DAYCARE + HOSTEL + OTHERS)
// ==========================================================

// 🔥 Universal booking fetcher
router.get("/bookings", verifyAdmin, (req, res) => {
  const daycareQuery = `
      SELECT d.id, 'daycare' AS type, u.name AS user_name,
      d.pet_name, d.pet_type, d.slot, d.day, d.status, d.created_at
      FROM daycare_bookings d
      JOIN users u ON d.user_id = u.id
  `;

  const hostelQuery = `
      SELECT h.id, 'hostel' AS type, u.name AS user_name,
      h.pet_name, h.pet_type, h.slot, h.day, h.status, h.created_at
      FROM hostel_bookings h
      JOIN users u ON h.user_id = u.id
  `;

  db.query(`${daycareQuery} UNION ALL ${hostelQuery}`, (err, results) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success", bookings: results });
  });
});

// -----------------------------
//  DELETE BOOKING (ANY TYPE)
// -----------------------------
router.delete("/bookings/:type/:id", verifyAdmin, (req, res) => {
  const { type, id } = req.params;

  const table =
    type === "daycare"
      ? "daycare_bookings"
      : type === "hostel"
      ? "hostel_bookings"
      : null;

  if (!table)
    return res.json({ status: "fail", message: "Invalid booking type" });

  db.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
    if (err) return res.json({ status: "error", error: err });
    res.json({ status: "success", message: "Booking deleted" });
  });
});

// -----------------------------
//  UPDATE BOOKING STATUS
// -----------------------------
router.put("/bookings/:type/:id", verifyAdmin, (req, res) => {
  const { type, id } = req.params;
  const { status } = req.body;

  const table =
    type === "daycare"
      ? "daycare_bookings"
      : type === "hostel"
      ? "hostel_bookings"
      : null;

  if (!table)
    return res.json({ status: "fail", message: "Invalid booking type" });

  db.query(
    `UPDATE ${table} SET status = ? WHERE id = ?`,
    [status, id],
    (err) => {
      if (err) return res.json({ status: "error", error: err });
      res.json({ status: "success", message: "Status updated" });
    }
  );
});

// -----------------------------
module.exports = router;
