// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authAdmin = require("../middleware/authAdmin");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// --- TEST ROUTE
router.get("/test", (req, res) => res.send("Admin route is working"));

// --- LOGIN (already had this) ---
router.post("/login", async (req, res) => {
  console.log("📌 /admin/login HIT");
  const { email, password } = req.body;
  console.log("📌 Body received:", req.body);

  if (!email || !password) {
    return res.json({ status: "fail", message: "Missing fields" });
  }

  db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email], async (err, users) => {
    console.log("📌 DB Response:", { err, users });
    if (err) return res.json({ status: "error", error: err });
    if (!users || users.length === 0) return res.json({ status: "fail", message: "User not found" });

    const user = users[0];
    if (user.role !== "admin") return res.json({ status: "fail", message: "Not an admin" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.json({ status: "fail", message: "Wrong password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d"
    });

    return res.json({
      status: "success",
      message: "Admin logged in",
      token,
      admin: { id: user.id, name: user.name, email: user.email }
    });
  });
});

// --- GET ALL USERS (protected) ---
router.get("/users", authAdmin, (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    return res.json({ status: "success", users: rows });
  });
});

// --- DELETE USER (protected) ---
router.delete("/users/:id", authAdmin, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    return res.json({ status: "success", message: "User deleted" });
  });
});

/*
  BOOKINGS aggregation:
  We support types: daycare, hostel, grooming, walking, vet, food
  Each booking table should have at least:
    id, user_id, user_name, pet_name, status, day (or date), created_at
*/

// Helper to build union query
function bookingsUnionQuery() {
  // SELECTs must return same columns: id, user_id, user_name, pet_name, type, status, day, created_at
  const selects = [
    `SELECT id, user_id, user_name, pet_name, 'daycare' as type, status, day, created_at FROM daycare_bookings`,
    `SELECT id, user_id, user_name, pet_name, 'hostel' as type, status, day, created_at FROM hostel_bookings`,
    `SELECT id, user_id, user_name, pet_name, 'grooming' as type, status, day, created_at FROM grooming_bookings`,
    `SELECT id, user_id, user_name, pet_name, 'walking' as type, status, day, created_at FROM walking_bookings`,
    `SELECT id, user_id, user_name, pet_name, 'vet' as type, status, day, created_at FROM vet_bookings`,
    `SELECT id, user_id, user_name, pet_name, 'food' as type, status, day, created_at FROM food_bookings`
  ];
  return selects.join(" UNION ALL ");
}

// --- GET ALL BOOKINGS (protected) ---
router.get("/bookings", authAdmin, (req, res) => {
  // optional ?type=daycare|hostel|grooming|walking|vet|food
  const type = req.query.type;
  if (type) {
    // simple whitelist
    const allowed = ["daycare", "hostel", "grooming", "walking", "vet", "food"];
    if (!allowed.includes(type)) {
      return res.status(400).json({ status: "fail", message: "Invalid booking type" });
    }
    const table = `${type}_bookings`;
    const q = `SELECT id, user_id, user_name, pet_name, '${type}' as type, status, day, created_at FROM ${table} ORDER BY created_at DESC`;
    return db.query(q, (err, rows) => {
      if (err) return res.status(500).json({ status: "error", error: err });
      return res.json({ status: "success", bookings: rows });
    });
  }

  // aggregate all
  const q = `${bookingsUnionQuery()} ORDER BY created_at DESC`;
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    return res.json({ status: "success", bookings: rows });
  });
});

// --- DELETE booking by type & id (protected) ---
router.delete("/bookings/:type/:id", authAdmin, (req, res) => {
  const { type, id } = req.params;
  const allowed = ["daycare", "hostel", "grooming", "walking", "vet", "food"];
  if (!allowed.includes(type)) return res.status(400).json({ status: "fail", message: "Invalid type" });
  const table = `${type}_bookings`;
  db.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    return res.json({ status: "success", message: "Booking deleted" });
  });
});

// --- UPDATE booking (status etc) (protected) ---
router.put("/bookings/:type/:id", authAdmin, (req, res) => {
  const { type, id } = req.params;
  const allowed = ["daycare", "hostel", "grooming", "walking", "vet", "food"];
  if (!allowed.includes(type)) return res.status(400).json({ status: "fail", message: "Invalid type" });

  // only allow status update for simplicity; you can expand to other fields
  const { status, day, pet_name } = req.body;
  const fields = [];
  const params = [];

  if (status) { fields.push("status = ?"); params.push(status); }
  if (day) { fields.push("day = ?"); params.push(day); }
  if (pet_name) { fields.push("pet_name = ?"); params.push(pet_name); }

  if (fields.length === 0) return res.status(400).json({ status: "fail", message: "No fields to update" });

  const table = `${type}_bookings`;
  const sql = `UPDATE ${table} SET ${fields.join(", ")} WHERE id = ?`;
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    return res.json({ status: "success", message: "Booking updated", changed: result.changedRows || 0 });
  });
});

module.exports = router;
