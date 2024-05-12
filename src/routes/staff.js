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
    const { name, email, password, contact_information, qualifications, role, availability } = req.body;
    // Create new staff member in the database
    const bcrypt = require('bcrypt');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new staff member in the database
    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contact_information,
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

// GET a specific staff member by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await prisma.staff.findUnique({
      where: { staff_id: parseInt(id) },
    });
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a staff member by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await prisma.staff.delete({
      where: { staff_id: parseInt(id) }
    });
    res.status(200).json({ message: 'Staff deleted successfully', staff });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

// PUT - Update a staff member completely
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, contact_information, qualifications, role, availability } = req.body;
  try {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);  // Assuming you need to update the password

    const updatedStaff = await prisma.staff.update({
      where: { staff_id: parseInt(id) },
      data: {
        name,
        email,
        password: hashedPassword,
        contact_information,
        qualifications,
        role,
        availability
      }
    });
    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// PATCH - Partially update a staff member
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Optionally handle password updates
  if (updateData.password) {
    const bcrypt = require('bcrypt');
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  try {
    const updatedStaff = await prisma.staff.update({
      where: { staff_id: parseInt(id) },
      data: updateData
    });
    res.json(updatedStaff);
  } catch (error) {
    console.error('Error partially updating staff member:', error);
    res.status(500).json({ error: 'Failed to partially update staff member' });
  }
});

module.exports = router;



module.exports = router;
