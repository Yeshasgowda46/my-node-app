const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createStore } = require('../db/store');

const users = createStore('users');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = users.findOne((u) => u.email === email.toLowerCase());
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = users.insert({ name, email: email.toLowerCase(), password: hashed, phone: phone || '' });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = users.findOne((u) => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = (req, res) => {
  const { _id, name, email, phone } = req.user;
  res.json({ user: { id: _id, name, email, phone } });
};
