// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ status: "error", error: "No token provided" });

  const secret = process.env.JWT_SECRET || "change_this_secret";
  try {
    const payload = jwt.verify(token, secret);
    // optional: check role
    if (!payload || !payload.isAdmin) {
      return res.status(403).json({ status: "error", error: "Not authorized" });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", error: "Invalid token" });
  }
};
