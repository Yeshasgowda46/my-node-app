const jwt = require('jsonwebtoken');
const { createStore } = require('../db/store');

const users = createStore('users');

const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const user = users.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = { protect };
