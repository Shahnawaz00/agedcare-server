const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to convert date string to SQL datetime format
const convertToDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toISOString();
};

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
    const idate = convertToDate(req.body.lastRestocked);

    try {
        const newItem = await prisma.inventory.create({
            data: {
                medication_id: parseInt(req.body.medicationId, 10), // Ensure medication_id is an integer
                quantity: parseInt(req.body.quantity, 10), // Ensure quantity is an integer
                last_restocked: idate, // Convert date string to Date object
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
