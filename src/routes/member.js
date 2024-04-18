const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET member by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.member.findUnique({ where: { member_id: parseInt(id) } });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to convert date string to SQL datetime format
const convertToDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toISOString();
  };
// POST create new member
router.post('/', async (req, res) => {
    const dateOfBirth = convertToDate(req.body.dateOfBirth);
    try {
      // Create a new member along with associated data
      const newMember = await prisma.member.create({
        data: {
            name: req.body.name,
            date_of_birth: dateOfBirth, // Use the corrected field name
            gender: req.body.gender,
            emergency_contact: req.body.emergencyContact,
            next_of_kin: req.body.nextOfKin,
            mailing_address: req.body.mailingAddress,
            allergies_or_diet: req.body.allergiesOrDiet,
            current_medications: req.body.currentMedications,
            general_practitioner: req.body.generalPractitioner,
        },
      });
      res.status(201).json(newMember); // Send the newly created member as JSON response
    } catch (error) {
      console.error('Error creating member:', error);
      res.status(500).json({ error: 'Failed to create member' }); // Handle server error
    }
  });

// PUT update member by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedMember = req.body;
  try {
    const existingMember = await prisma.member.findUnique({ where: { member_id: parseInt(id) } });
    if (!existingMember) {
      return res.status(404).json({ error: 'Member not found' });
    }
    const updated = await prisma.member.update({ where: { member_id: parseInt(id) }, data: updatedMember });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE member by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.member.delete({ where: { member_id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
