const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.json({ status: "error" });

    if (results.length > 0)
      return res.json({ status: "fail", message: "Email already registered" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.json({ status: "error" });

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.json({ status: "error" });
          res.json({ status: "success", message: "User created" });
        }
      );
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.json({ status: "error" });

    if (results.length === 0)
      return res.json({ status: "fail", message: "Invalid credentials" });

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.json({ status: "error" });

      if (!isMatch)
        return res.json({ status: "fail", message: "Invalid credentials" });

      const token = jwt.sign(
        { id: results[0].id, email: results[0].email },
        "MY_SECRET_KEY",
        { expiresIn: "7d" }
      );

      res.json({
  status: "success",
  token,
  user: {
    id: results[0].id,
    name: results[0].name,
    email: results[0].email,
    role: results[0].role
  }
});

    });
  });
});

module.exports = router;
