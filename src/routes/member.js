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
  try {
    // Extract data from request body
    const { name, email, password, medicare_number, medicare_irn, gender, phoneNo, emergency_phoneNo, emergency_contact, next_of_kin, nok_name, nok_phoneNo, nok_email, nok_relationship, mailing_address, billing_address, allergies_or_diet, allergies, medical_conditions, dietary_restrictions, current_medications, general_practitioner } = req.body;
    
    // Hash the password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const date_of_birth = convertToDate(req.body.date_of_birth);
    const medicare_expiry_date = convertToDate(req.body.medicare_expiry_date);

    // Create new member in the database
    const newMember = await prisma.member.create({
      data: {
        name,
        email,
        // password: hashedPassword,
        date_of_birth,
        medicare_number,
        medicare_irn,
        medicare_expiry_date,
        gender,
        phoneNo,
        emergency_phoneNo,
        emergency_contact,
        next_of_kin,
        nok_name,
        nok_phoneNo,
        nok_email,
        nok_relationship,
        mailing_address,
        billing_address,
        allergies_or_diet,
        allergies,
        medical_conditions,
        dietary_restrictions,
        current_medications,
        general_practitioner
      }
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
