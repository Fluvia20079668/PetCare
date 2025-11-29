const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    // ensure role admin
    if (payload.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Forbidden' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
}

module.exports = adminAuth;