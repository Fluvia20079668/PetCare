const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// Signup Route
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const cleanEmail = email.trim();

  db.query("SELECT * FROM users WHERE email = ?", [cleanEmail], (err, results) => {
    if (err) return res.json({ status: "error" });

    if (results.length > 0)
      return res.json({ status: "fail", message: "Email already registered" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.json({ status: "error" });

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, cleanEmail, hashedPassword, "user"],
        (err) => {
          if (err) return res.json({ status: "error" });

          res.json({ status: "success", message: "User created" });
        }
      );
    });
  });
});

// Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim();

  db.query("SELECT * FROM users WHERE email = ?", [cleanEmail], async (err, results) => {
    if (err) return res.json({ status: "error", error: err });

    if (results.length === 0) {
      return res.json({ status: "fail", message: "Invalid credentials" });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ status: "fail", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      status: "success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

module.exports = router;
