const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const ACCESS_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'todo_fallback_access_secret_01521428527';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token payload.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User does not exist.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Session expired or token invalid.' });
  }
};

module.exports = { protect };
