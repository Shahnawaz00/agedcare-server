const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new service
router.post('/', async (req, res) => {
  const { service_type, duration, description } = req.body;
  try {
    const newService = await prisma.service.create({
      data: {
        service_type,
        duration,
        description
      }
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

module.exports = router;
