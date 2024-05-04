const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all staff
router.get('/', async (req, res) => {
  try {
    const staff = await prisma.staff.findMany();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET staff by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await prisma.staff.findUnique({ where: { staff_id: parseInt(id) } });
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
