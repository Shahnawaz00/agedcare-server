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
    const dateOfBirth = convertToDate(req.body.date_of_birth);
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
// PUT - Update a member completely
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const dateOfBirth = convertToDate(req.body.date_of_birth);

  try {
    const updatedMember = await prisma.member.update({
      where: { member_id: parseInt(id) },
      data: {
        name: req.body.name,
        date_of_birth: dateOfBirth,
        gender: req.body.gender,
        emergency_contact: req.body.emergencyContact,
        next_of_kin: req.body.nextOfKin,
        mailing_address: req.body.mailingAddress,
        allergies_or_diet: req.body.allergiesOrDiet,
        current_medications: req.body.currentMedications,
        general_practitioner: req.body.generalPractitioner,
      }
    });
    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});
// PATCH - Partially update a member
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Handle date of birth conversion if provided
  if (updateData.date_of_birth) {
    updateData.date_of_birth = convertToDate(updateData.date_of_birth);
    delete updateData.date_of_birth; // Remove the original key to avoid confusion
  }

  try {
    const updatedMember = await prisma.member.update({
      where: { member_id: parseInt(id) },
      data: updateData
    });
    res.json(updatedMember);
  } catch (error) {
    console.error('Error partially updating member:', error);
    res.status(500).json({ error: 'Failed to partially update member' });
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
