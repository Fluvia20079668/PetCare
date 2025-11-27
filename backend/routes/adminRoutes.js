// -----------------------------
// ADMIN LOGIN
// -----------------------------
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({ status: "fail", message: "Missing fields" });

  db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
    (err, users) => {
      if (err) return res.json({ status: "error", error: err });
      if (users.length === 0)
        return res.json({ status: "fail", message: "User not found" });

      const user = users[0];

      // Only admin can login!
      if (user.role !== "admin")
        return res.json({ status: "fail", message: "Not an admin" });

      // Simple password check (you can replace with bcrypt)
      if (user.password !== password)
        return res.json({ status: "fail", message: "Wrong password" });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        "SECRET_KEY",
        { expiresIn: "7d" }
      );

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
