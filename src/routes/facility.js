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
    const date_reserved = req.body.date_reserved ? convertToDate(req.body.date_reserved) : undefined;
    try {
        const existingFacility = await prisma.facility.findUnique({ where: { facility_id: parseInt(id) } });
        if (!existingFacility) {
            return res.status(404).json({ error: 'Facility not found' });
        }
        const updatedFacility = await prisma.facility.update({
            where: { facility_id: parseInt(id) },
            data: {
                room_number: req.body.room_number,
                occupancy_status: req.body.occupancy_status,
                reservation_length: req.body.reservation_length,
                date_reserved: date_reserved,
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
// PATCH - Partially update a facility
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Convert dateReserved to SQL datetime format if provided
    if (updateData.date_reserved) {
        updateData.date_reserved = convertToDate(updateData.date_reserved);
    }

    try {
        const updatedFacility = await prisma.facility.update({
            where: { facility_id: parseInt(id) },
            data: updateData
        });
        res.json(updatedFacility);
    } catch (error) {
        console.error('Error updating facility:', error);
        if (error.code === "P2025") { // Check for specific Prisma error code for not found
            res.status(404).json({ error: 'Facility not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;
