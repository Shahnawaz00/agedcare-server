const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const convertToDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day );
  };

// GET all appointments
// GET appointments by date
router.get('/', async (req, res) => {
    try {
      const { staff_id, date } = req.query;
      let appointments;
      if (staff_id && date) {
        // Convert date string to JavaScript Date object
        const parsedDate = convertToDate(date);
        if (!isNaN(parsedDate)) {
          appointments = await prisma.appointment.findMany({
            where: {
              staff_id: parseInt(staff_id),
              appointment_date: parsedDate
            },
            sort: {
              appointment_date: 'asc',
              appointment_time: 'asc'
            }
          });
        } else {
          return res.status(400).json({ error: 'Invalid date format' });
        }
      } else if (staff_id) {
        appointments = await prisma.appointment.findMany(
            {
                where: {
                staff_id: parseInt(staff_id)
                }
            }
        );
      } else if (date) {
        // Convert date string to JavaScript Date object
        const parsedDate = convertToDate(date);
        if (!isNaN(parsedDate)) {
          appointments = await prisma.appointment.findMany({
            where: {
              appointment_date: parsedDate
            }
          });
        } else {
          return res.status(400).json({ error: 'Invalid date format' });
        }
      }
      
      if (appointments.length === 0) {
        return res.status(404).json({ error: 'No appointments found' });
      }
  
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;