const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ADMIN LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=? LIMIT 1", [email], async (err, rows) => {
    if (err) return res.json({ status:"error", error:err });
    if (rows.length === 0) return res.json({ status:"fail", message:"User not found" });

    const admin = rows[0];

    if (admin.role !== "admin") {
      return res.json({ status: "fail", message: "Not an admin" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ status:"fail", message:"Wrong password" });

    const token = jwt.sign({ id: admin.id, role: "admin" }, "SECRET_KEY", { expiresIn: "7d" });

    return res.json({
      status: "success",
      message: "Logged in",
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name }
    });
  });
});

// GET ALL USERS
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id DESC", (err, users) => {
    if (err) return res.json({ status:"error", error:err });
    res.json({ status:"success", users });
  });
});

// DELETE USER
router.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json({ status:"error", error:err });
    res.json({ status:"success" });
  });
});

// ----------- UNIVERSAL SERVICE FETCH ------------
router.get("/bookings", (req, res) => {
  const queries = {
    daycare: "SELECT d.*, u.name AS user_name FROM daycare_bookings d LEFT JOIN users u ON u.id=d.user_id",
    hostel: "SELECT h.*, u.name AS user_name FROM hostel_bookings h LEFT JOIN users u ON u.id=h.user_id",
    grooming: "SELECT g.*, u.name AS user_name FROM grooming_bookings g LEFT JOIN users u ON u.id=g.user_id",
    walking: "SELECT w.*, u.name AS user_name FROM walking_bookings w LEFT JOIN users u ON u.id=w.user_id",
    vet: "SELECT v.*, u.name AS user_name FROM vet_checkup_bookings v LEFT JOIN users u ON u.id=v.user_id",
    food: "SELECT f.*, u.name AS user_name FROM food_delivery_orders f LEFT JOIN users u ON u.id=f.user_id"
  };

  let data = {};

  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.query(sql, (err, rows) => {
      data[key] = rows || [];

      completed++;
      if (completed === total) {
        res.json({ status: "success", data });
      }
    });
  });
});

// ----------- STATUS UPDATE -----------
router.put("/bookings/:service/:id", (req, res) => {
  const { service, id } = req.params;
  const { status } = req.body;

  const tableMap = {
    daycare: "daycare_bookings",
    hostel: "hostel_bookings",
    grooming: "grooming_bookings",
    walking: "walking_bookings",
    vet: "vet_checkup_bookings",
    food: "food_delivery_orders"
  };

  const table = tableMap[service];
  if (!table) return res.json({ status:"error", message:"Invalid service" });

  db.query(`UPDATE ${table} SET status=? WHERE id=?`, [status, id], (err) => {
    if (err) return res.json({ status:"error", error:err });
    res.json({ status:"success" });
  });
});

// ----------- DELETE BOOKING -----------
router.delete("/bookings/:service/:id", (req, res) => {
  const { service, id } = req.params;

  const tableMap = {
    daycare: "daycare_bookings",
    hostel: "hostel_bookings",
    grooming: "grooming_bookings",
    walking: "walking_bookings",
    vet: "vet_checkup_bookings",
    food: "food_delivery_orders"
  };

  const table = tableMap[service];
  if (!table) return res.json({ status:"error", message:"Invalid service" });

  db.query(`DELETE FROM ${table} WHERE id=?`, [id], (err) => {
    if (err) return res.json({ status:"error", error:err });
    res.json({ status:"success" });
  });
});

module.exports = router;
