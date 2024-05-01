const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany({
            include: {
                staff: true // Assuming there's a relation to a staff model, include it if needed
            }
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET schedule by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const schedule = await prisma.schedule.findUnique({
            where: { schedule_id: parseInt(id) },
            include: {
                staff: true // Include staff details if there's a relation
            }
        });
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create new schedule
router.post('/', async (req, res) => {
    const { staff_id, date, shift_start_time, shift_end_time } = req.body;
    try {
        const newSchedule = await prisma.schedule.create({
            data: {
                staff_id: parseInt(staff_id), // Convert staff_id to integer
                date: new Date(date), // Convert string to Date object
                shift_start_time,
                shift_end_time,
            }
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
});

// PUT update schedule by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { staff_id, date, shift_start_time, shift_end_time } = req.body;
    try {
        const existingSchedule = await prisma.schedule.findUnique({ where: { schedule_id: parseInt(id) } });
        if (!existingSchedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        const updatedSchedule = await prisma.schedule.update({
            where: { schedule_id: parseInt(id) },
            data: {
                staff_id: parseInt(staff_id),
                date: new Date(date),
                shift_start_time,
                shift_end_time,
            }
        });
        res.json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE schedule by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.schedule.delete({ where: { schedule_id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
