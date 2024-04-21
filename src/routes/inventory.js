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
router.get('/medications', async (req, res) => {
    try {
        const medications = await prisma.medication.findMany();
        res.json(medications);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET medication by ID
router.get('/medications/:id', async (req, res) => {
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
router.post('/medications', async (req, res) => {
    try {
        const newMedication = await prisma.medication.create({
            data: {
                medication_name: req.body.medication_name,
                dosage_form: req.body.dosage_form,
                expiration_date: req.body.expiration_date,
            },
        });
        res.status(201).json(newMedication);
    } catch (error) {
        console.error('Error creating medication:', error);
        res.status(500).json({ error: 'Failed to create medication' });
    }
});

// PUT update medication by ID
router.put('/medications/:id', async (req, res) => {
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
router.delete('/medications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.medication.delete({ where: { medication_id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET all inventory items
router.get('/', async (req, res) => {
    try {
        const inventory = await prisma.inventory.findMany();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET inventory item by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await prisma.inventory.findUnique({ where: { inventory_id: parseInt(id) } });
        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create new inventory item
router.post('/', async (req, res) => {
    try {
        const newItem = await prisma.inventory.create({
            data: {
                medication_id: req.body.medication_id,
                name: req.body.name,
                quantity: req.body.quantity,
                last_restocked: req.body.last_restocked,
            },
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
});

// PUT update inventory item by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    try {
        const existingItem = await prisma.inventory.findUnique({ where: { inventory_id: parseInt(id) } });
        if (!existingItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        const updated = await prisma.inventory.update({ where: { inventory_id: parseInt(id) }, data: updatedItem });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE inventory item by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.inventory.delete({ where: { inventory_id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
