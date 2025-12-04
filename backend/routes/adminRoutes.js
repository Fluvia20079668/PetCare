const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// TEST
router.get("/test", (req, res) => {
  res.json({ status: "success", message: "Admin route working" });
});

// GET ALL USERS
router.get("/users", (req, res) => {
  db.query(
    "SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC",
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", users: result });
    }
  );
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "fail", message: "Missing email or password" });
  }

  // Find the admin user by email
  const sql = "SELECT id, name, email, role, password FROM users WHERE email = ? AND role = 'admin'";
  
  db.query(sql, [email], async (err, results) => { // ✅ Use async for bcrypt.compare
    if (err) return res.status(500).json({ status: "error", error: err.message });

    // Check if user was found
    if (results.length === 0) {
      return res.json({ status: "fail", message: "Invalid admin credentials" });
    }

    const admin = results[0];
    const storedHash = admin.password;
    
    // Compare the plain-text password with the stored hash
    try {
        const isMatch = await bcrypt.compare(password, storedHash);

        if (!isMatch) {
            return res.json({ status: "fail", message: "Invalid admin credentials" });
        }
        
        // Success: passwords match
        res.json({
            status: "success",
            admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
            token: "dummy-admin-token"
        });

    } catch (compareError) {
        console.error("Bcrypt compare failed:", compareError);
        return res.status(500).json({ status: "error", error: "Authentication error" });
    }
  });
});

// DELETE USER
router.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "User deleted" });
  });
});

module.exports = router;
