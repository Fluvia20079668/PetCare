const express = require("express");
const router = express.Router();
const db = require("../db");

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

// DELETE USER
router.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", message: "User deleted" });
  });
});

module.exports = router;
