const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET members by staff ID
router.get('/', async (req, res) => {
  try {
    const { staff_id } = req.query;
    
    // Check if staff_id is provided
    if (!staff_id) {
      return res.status(400).json({ error: 'Staff ID is required' });
    }

    // Check if staff_id is a valid number
    if (isNaN(staff_id)) {
      return res.status(400).json({ error: 'Staff ID must be a number' });
    }

    // Fetch appointments for the staff
    const appointments = await prisma.appointment.findMany({
      where: {
        staff_id: parseInt(staff_id) // Convert staff_id to integer
      },
      select: {
        member_id: true // Select only member_id from appointments
      }
    });

    // Extract member_ids from appointments
    const memberIds = appointments.map(appointment => appointment.member_id);

    // Fetch members with matching member_ids
    const members = await prisma.member.findMany({
      where: {
        member_id: {
          in: memberIds
        }
      }
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
