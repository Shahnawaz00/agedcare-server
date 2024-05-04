const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


// Function to convert date string to SQL datetime format
const convertToDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toISOString();
};

// GET all medications
router.get('/', async (req, res) => {
    try {
        const medications = await prisma.medication.findMany();
        res.json(medications);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET medication by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const medication = await prisma.medication.findUnique({ where: { medication_id: parseInt(id) } });
        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        res.json(medication);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create new medication
router.post('/', async (req, res) => {
    const date = convertToDate(req.body.expiration_date);
    try {
        const newMedication = await prisma.medication.create({
            data: {
                medication_name: req.body.medication_name,
                dosage_form: req.body.dosage_form,
                expiration_date: date,
            },
        });
        res.status(201).json(newMedication);
    } catch (error) {
        console.error('Error creating medication:', error);
        res.status(500).json({ error: 'Failed to create medication' });
    }
});

// PUT update medication by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedMedication = req.body;
    try {
        const existingMedication = await prisma.medication.findUnique({ where: { medication_id: parseInt(id) } });
        if (!existingMedication) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        const updated = await prisma.medication.update({ where: { medication_id: parseInt(id) }, data: updatedMedication });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE medication by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.medication.delete({ where: { medication_id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
