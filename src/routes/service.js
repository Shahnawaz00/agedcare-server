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

// GET a specific service by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.findUnique({
      where: { service_id: parseInt(id) },
    });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a service by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.service.delete({
      where: { service_id: parseInt(id) }
    });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});
// PUT - Update a service completely
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { service_type, duration, description } = req.body;

  try {
    const updatedService = await prisma.service.update({
      where: { service_id: parseInt(id) },
      data: {
        service_type,
        duration,
        description
      }
    });
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});
// PATCH - Partially update a service
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    const updatedService = await prisma.service.update({
      where: { service_id: parseInt(id) },
      data: updateData
    });
    res.json(updatedService);
  } catch (error) {
    console.error('Error partially updating service:', error);
    res.status(500).json({ error: 'Failed to partially update service' });
  }
});

module.exports = router;
