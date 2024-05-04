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

// GET service by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.findUnique({ where: { service_id: parseInt(id) } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { service_type, duration, description } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        service_type,
        duration,
        description,
      },
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
);




module.exports = router;
