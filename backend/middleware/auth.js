// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ status: 'fail', message: 'No token provided' });

  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ status: 'fail', message: 'Token error' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ status: 'fail', message: 'Token malformatted' });

  try {
    const decoded = jwt.verify(token, SECRET);
    // require admin role
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Not authorized' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
}

module.exports = { adminAuth };
