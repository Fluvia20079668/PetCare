const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Admin route is working");
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  console.log("📌 /admin/login HIT");  // Log 1
  
  const { email, password } = req.body;
  console.log("📌 Body received:", req.body);  // Log 2

  if (!email || !password) {
    console.log("❌ Missing fields");
    return res.json({ status: "fail", message: "Missing fields" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
    async (err, users) => {
      console.log("📌 DB Response:", { err, users });  // Log 3

      if (err) {
        console.log("❌ DB Error:", err);
        return res.json({ status: "error", error: err });
      }

      if (users.length === 0) {
        console.log("❌ User not found");
        return res.json({ status: "fail", message: "User not found" });
      }

      const user = users[0];
      console.log("📌 User Found:", user);  // Log 4

      if (user.role !== "admin") {
        console.log("❌ Not an admin");
        return res.json({ status: "fail", message: "Not an admin" });
      }

      console.log("📌 Comparing passwords...");
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("📌 Password match:", isMatch);  // Log 5

      if (!isMatch) {
        console.log("❌ Wrong password");
        return res.json({ status: "fail", message: "Wrong password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        "SECRET_KEY",
        { expiresIn: "7d" }
      );

      console.log("✅ LOGIN SUCCESS");
      res.json({
        status: "success",
        message: "Admin logged in",
        token,
        admin: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

module.exports = router;
