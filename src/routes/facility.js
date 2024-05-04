const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await prisma.facility.findMany();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET facility by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const facility = await prisma.facility.findUnique({ where: { facility_id: parseInt(id) } });
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json(facility);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
