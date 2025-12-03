const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ using bcryptjs
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// ✅ USER SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const cleanEmail = email.trim().toLowerCase();

  db.query("SELECT * FROM users WHERE email = ?", [cleanEmail], (err, results) => {
    if (err) return res.json({ status: "error" });

    if (results.length > 0)
      return res.json({ status: "fail", message: "Email already registered" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.json({ status: "error" });

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
        [name, cleanEmail, hashedPassword],
        (err) => {
          if (err) return res.json({ status: "error" });
          res.json({ status: "success", message: "User created" });
        }
      );
    });
  });
});

// ✅ USER + ADMIN LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const cleanEmail = email.trim().toLowerCase();

  const sql = "SELECT * FROM users WHERE LOWER(email) = ?";
  db.query(sql, [cleanEmail], async (err, results) => {
    if (err) return res.json({ status: "error", error: err });

    if (results.length === 0) {
      console.log("LOGIN FAILED: USER NOT FOUND");
      return res.json({ status: "fail", message: "User not found" });
    }

    const user = results[0];

    console.log("Stored hash:", user.password);
    console.log("Entered password:", password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      console.log("LOGIN FAILED: INCORRECT PASSWORD");
      return res.json({ status: "fail", message: "Incorrect password" });
    }

    console.log("LOGIN SUCCESS:", user.email);

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
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

//booking details in avatar

router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const query = "SELECT * FROM bookings WHERE userId = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;


