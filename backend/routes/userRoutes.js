const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Signup
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.json({ status: "error", error: err });
    if (results.length > 0)
      return res.json({ status: "fail", message: "Email already registered" });

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.json({ status: "error", error: err });

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.json({ status: "error", error: err });
          res.json({ status: "success", message: "User created" });
        }
      );
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.json({ status: "error", error: err });
    if (results.length === 0)
      return res.json({ status: "fail", message: "Invalid credentials" });

    // Compare hashed password
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.json({ status: "error", error: err });
      if (!isMatch)
        return res.json({ status: "fail", message: "Invalid credentials" });

      res.json({ status: "success", user: results[0] });
    });
  });
});

module.exports = router;
