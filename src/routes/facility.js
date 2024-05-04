const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to convert date string to SQL datetime format
const convertToDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toISOString();
};

// GET all facilities
router.get('/', async (req, res) => {
    try {
        const facilities = await prisma.facility.findMany();
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET facility by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const facility = await prisma.facility.findUnique({
            where: { facility_id: parseInt(id) }
        });
        if (facility) {
            res.json(facility);
        } else {
            res.status(404).json({ error: 'Facility not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create new facility
router.post('/', async (req, res) => {
    const dateReserved = req.body.dateReserved ? convertToDate(req.body.dateReserved) : null;
    try {
        const newFacility = await prisma.facility.create({
            data: {
                room_number: req.body.roomNumber,
                occupancy_status: req.body.occupancyStatus,
                reservation_length: req.body.reservationLength,
                date_reserved: dateReserved,  // Use converted date
            },
        });
        res.status(201).json(newFacility);
    } catch (error) {
        console.error('Error creating facility:', error);
        res.status(500).json({ error: 'Failed to create facility' });
    }
});

// PUT update facility by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const dateReserved = req.body.dateReserved ? convertToDate(req.body.dateReserved) : undefined;
    try {
        const existingFacility = await prisma.facility.findUnique({ where: { facility_id: parseInt(id) } });
        if (!existingFacility) {
            return res.status(404).json({ error: 'Facility not found' });
        }
        const updatedFacility = await prisma.facility.update({
            where: { facility_id: parseInt(id) },
            data: {
                roomNumber: req.body.roomNumber,
                occupancyStatus: req.body.occupancyStatus,
                reservationLength: req.body.reservationLength,
                dateReserved: dateReserved,
            },
        });
        res.json(updatedFacility);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE facility by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.facility.delete({ where: { facility_id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
