// backend/middleware/authAdmin.js
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "SECRET_KEY";

function authAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ status: "fail", message: "No token" });

  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ status: "fail", message: "Invalid token" });

  try {
    const payload = jwt.verify(token, SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Forbidden" });
    }
    // attach user info for convenience
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: "fail", message: "Token invalid" });
  }
}

module.exports = authAdmin;
