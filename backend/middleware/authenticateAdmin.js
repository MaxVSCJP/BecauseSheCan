const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieToken = req.cookies?.token;
    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server auth not configured' });
    }

    const payload = jwt.verify(token, secret);
    const adminUser = await AdminUser.findById(payload.sub).select('_id username role');

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    req.admin = {
      id: adminUser._id.toString(),
      username: adminUser.username,
      role: adminUser.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateAdmin;
