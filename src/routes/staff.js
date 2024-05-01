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

// POST create new staff member
router.post('/', async (req, res) => {
  try {
    // Extract data from request body
    const { name, email, password, contactInformation, qualifications, role, availability } = req.body;
    // Create new staff member in the database
    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        password,  // Note: Store passwords securely using hashing (e.g., bcrypt) in a real application
        contactInformation,
        qualifications,
        role,
        availability
      }
    });
    // Send the newly created staff member as the response
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

module.exports = router;
