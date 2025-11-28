// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminAuth } = require("../middleware/auth");

const SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// TEST
router.get("/test", (req, res) => res.send("Admin route is working"));

// ----- LOGIN (keep your existing behavior) -----
router.post("/login", async (req, res) => {
  console.log("📌 /admin/login HIT");
  const { email, password } = req.body;
  console.log("📌 Body received:", req.body);

  if (!email || !password) return res.json({ status: "fail", message: "Missing fields" });

  db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email], async (err, users) => {
    console.log("📌 DB Response:", { err, users });
    if (err) return res.json({ status: "error", error: err });
    if (!users || users.length === 0) return res.json({ status: "fail", message: "User not found" });

    const user = users[0];
    if (user.role !== "admin") return res.json({ status: "fail", message: "Not an admin" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: "fail", message: "Wrong password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "7d" });

    res.json({
      status: "success",
      message: "Admin logged in",
      token,
      admin: { id: user.id, name: user.name, email: user.email },
    });
  });
});

// ----- GET ALL USERS (admin only) -----
router.get("/users", adminAuth, (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", users: results });
  });
});

// ----- DELETE USER -----
router.delete("/users/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", message: "User deleted" });
  });
});

// ----- CREATE booking (generic) -----
// body: { type: "daycare"|"hostel"|..., details: {...} }
router.post("/bookings", adminAuth, (req, res) => {
  const { type, details } = req.body;
  if (!type || !details) return res.status(400).json({ status: "fail", message: "Missing type/details" });

  // map to table + columns - adapt as needed
  const mapping = {
    daycare: {
      table: "daycare_bookings",
      cols: ["user_id", "user_name", "pet_name", "day", "status"],
      vals: [details.user_id, details.user_name, details.pet_name, details.day || null, details.status || "pending"]
    },
    hostel: {
      table: "hostel_bookings",
      cols: ["user_id", "user_name", "pet_name", "day_from", "day_to", "status"],
      vals: [details.user_id, details.user_name, details.pet_name, details.day_from || null, details.day_to || null, details.status || "pending"]
    },
    grooming: {
      table: "grooming_bookings",
      cols: ["user_id", "user_name", "pet_name", "date", "status"],
      vals: [details.user_id, details.user_name, details.pet_name, details.date || null, details.status || "pending"]
    },
    walking: {
      table: "walking_bookings",
      cols: ["user_id", "user_name", "pet_name", "date", "status"],
      vals: [details.user_id, details.user_name, details.pet_name, details.date || null, details.status || "pending"]
    },
    vet: {
      table: "vet_bookings",
      cols: ["user_id", "user_name", "pet_name", "date", "status"],
      vals: [details.user_id, details.user_name, details.pet_name, details.date || null, details.status || "pending"]
    },
    food: {
      table: "food_delivery_orders",
      cols: ["user_id", "user_name", "address", "items", "date", "status"],
      vals: [details.user_id, details.user_name, details.address || null, JSON.stringify(details.items || []), details.date || null, details.status || "pending"]
    }
  };

  const def = mapping[type];
  if (!def) return res.status(400).json({ status: "fail", message: "Unknown booking type" });

  const sql = `INSERT INTO \`${def.table}\` (${def.cols.join(",")}) VALUES (${def.cols.map(()=>"?").join(",")})`;
  db.query(sql, def.vals, (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", id: result.insertId });
  });
});

// ----- GET ALL BOOKINGS (unified) -----
router.get("/bookings", adminAuth, async (req, res) => {
  // We'll fetch bookings from multiple tables and combine them with 'type' field
  const queries = [
    { sql: "SELECT id, user_id, user_name, pet_name, day AS day, status, created_at FROM daycare_bookings ORDER BY id DESC", type: "daycare" },
    { sql: "SELECT id, user_id, user_name, pet_name, CONCAT(day_from,' to ',day_to) AS day, status, created_at FROM hostel_bookings ORDER BY id DESC", type: "hostel" },
    { sql: "SELECT id, user_id, user_name, pet_name, date AS day, status, created_at FROM grooming_bookings ORDER BY id DESC", type: "grooming" },
    { sql: "SELECT id, user_id, user_name, pet_name, date AS day, status, created_at FROM walking_bookings ORDER BY id DESC", type: "walking" },
    { sql: "SELECT id, user_id, user_name, pet_name, date AS day, status, created_at FROM vet_bookings ORDER BY id DESC", type: "vet" },
    { sql: "SELECT id, user_id, user_name, address AS pet_name, date AS day, status, created_at FROM food_delivery_orders ORDER BY id DESC", type: "food" }
  ];

  try {
    const results = [];
    let pending = queries.length;
    queries.forEach(q => {
      db.query(q.sql, (err, rows) => {
        if (!err && rows && rows.length) {
          rows.forEach(r => {
            results.push({ ...r, type: q.type });
          });
        }
        pending -= 1;
        if (pending === 0) {
          // sort by created_at descending
          results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          res.json({ status: "success", bookings: results });
        }
      });
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
});

// ----- DELETE booking by type/id -----
router.delete("/bookings/:type/:id", adminAuth, (req, res) => {
  const { type, id } = req.params;
  const tableMap = {
    daycare: "daycare_bookings",
    hostel: "hostel_bookings",
    grooming: "grooming_bookings",
    walking: "walking_bookings",
    vet: "vet_bookings",
    food: "food_delivery_orders"
  };
  const table = tableMap[type];
  if (!table) return res.status(400).json({ status: "fail", message: "Unknown booking type" });

  db.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id], (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", message: "Booking deleted" });
  });
});

// ----- UPDATE booking status / details -----
router.put("/bookings/:type/:id", adminAuth, (req, res) => {
  const { type, id } = req.params;
  const payload = req.body; // expected to contain status or other fields
  const tableMap = {
    daycare: "daycare_bookings",
    hostel: "hostel_bookings",
    grooming: "grooming_bookings",
    walking: "walking_bookings",
    vet: "vet_bookings",
    food: "food_delivery_orders"
  };
  const table = tableMap[type];
  if (!table) return res.status(400).json({ status: "fail", message: "Unknown booking type" });

  // Build SET dynamically from payload (sanitize keys)
  const fields = Object.keys(payload).filter(k => ["status","day","day_from","day_to","date","user_name","pet_name","address","items"].includes(k));
  if (fields.length === 0) return res.status(400).json({ status: "fail", message: "Nothing to update" });

  const setStr = fields.map(f => `\`${f}\` = ?`).join(", ");
  const values = fields.map(f => (f === "items" ? JSON.stringify(payload[f]) : payload[f]));
  values.push(id);

  const sql = `UPDATE \`${table}\` SET ${setStr} WHERE id = ?`;
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", message: "Booking updated" });
  });
});

module.exports = router;
