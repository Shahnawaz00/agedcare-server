// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// User login
router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.admin.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'd3efa43e513a2b68b495f2a6139148ccaa39d9f851717c0dd9768cd505a5ddc81ff8076d95296acc742b5fb51a90450380d42572c08a9d0c843274a9b038131a', {
      expiresIn: '1h', // Set token expiration (optional)
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
