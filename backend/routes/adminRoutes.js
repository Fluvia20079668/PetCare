const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL POOL
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// -----------------------------
// TEST ROUTE
// -----------------------------
router.get("/test", (req, res) => {
  res.send("Admin route is working");
});


// -----------------------------
// ADMIN LOGIN
// -----------------------------
router.post("/login", async (req, res) => {
  console.log("📌 /admin/login HIT");
  const { email, password } = req.body;
  console.log("📌 Body received:", req.body);

  // Validate fields
  if (!email || !password) {
    console.log("❌ Missing fields");
    return res.json({ status: "fail", message: "Missing fields" });
  }

  try {
    // Run MySQL Query
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    console.log("📌 DB Response:", rows);

    if (rows.length === 0) {
      console.log("❌ User not found");
      return res.json({ status: "fail", message: "User not found" });
    }

    const user = rows[0];
    console.log("📌 User Found:", user);

    // Check admin role
    if (user.role !== "admin") {
      console.log("❌ Not an admin");
      return res.json({ status: "fail", message: "Not an admin" });
    }

    // Compare passwords
    console.log("📌 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("📌 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Wrong password");
      return res.json({ status: "fail", message: "Wrong password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    console.log("✅ LOGIN SUCCESS");

    return res.json({
      status: "success",
      message: "Admin logged in",
      token,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("❌ DB Error:", err);
    return res.json({ status: "error", message: "Database error", error: err });
  }
});

module.exports = router;
