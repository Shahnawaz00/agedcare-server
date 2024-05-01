const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all medications
router.get('/', async (req, res) => {
  try {
    const medications = await prisma.medication.findMany();
    res.json(medications);
  } catch (error) {
    console.error('Error retrieving medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to convert date string to SQL datetime format
const convertToDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toISOString();
  };

// POST create new medication
router.post('/', async (req, res) => {
  const { medication_name, dosage_form} = req.body;
  const expirationDate = convertToDate(req.body.expiration_date);

  try {
    const newMedication = await prisma.medication.create({
      data: {
        medication_name,
        dosage_form,
        expiration_date: expirationDate
      }
    });
    res.status(201).json(newMedication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
});

module.exports = router;
