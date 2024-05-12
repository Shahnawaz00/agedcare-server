// routes/profile.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
// const verifyToken = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// GET all profiles
router.get('/', async (req, res) => {
    try {
        const admin = await prisma.admin.findMany();
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});

// GET a specific admin member by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await prisma.admin.findUnique({
      where: { admin_id: parseInt(id) },
    });
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin member not found' });
    }
  } catch (error) {
    console.error('Error fetching Admin member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new profile
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin in the database with the hashed password
        const newAdmin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword  // Store the hashed password
            }
        });

        // Send the newly created admin as the response
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});


// PUT update profile by ID (full update)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updatedAdmin = await prisma.admin.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                password  // Consider security practices when updating passwords
            }
        });
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// PATCH update profile by ID (partial update)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAdmin = await prisma.admin.update({
            where: { admin_id: parseInt(id) },
            data: req.body  // Directly passing req.body assumes proper partial data is provided
        });
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// DELETE profile by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.admin.delete({
            where: { admin_id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete profile' });
    }
});

module.exports = router;
