// routes/profile.js
const express = require('express');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Protected route
router.get('/admin', verifyToken, (req, res) => {
  // Access user data using req.userId
  res.json({ message: 'Admin page' });
});

module.exports = router;
