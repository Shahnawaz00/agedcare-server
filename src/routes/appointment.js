const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const convertToDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
// GET all appointments
// GET appointments by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let appointments;
    if (date) {
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
    } else {
      appointments = await prisma.appointment.findMany();
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


// GET appointment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await prisma.appointment.findUnique({ where: { appointment_id: parseInt(id) } });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



// GET appointments by date
router.get('/date', async (req, res) => {
  try {
    const { date } = req.query;
    let appointments;
    if (date) {
      // Convert date string to JavaScript Date object
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate)) {
        appointments = await prisma.appointment.findMany({
          where: {
            appointment_date: parsedDate
          }
        });
      } else {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    } else {
      appointments = await prisma.appointment.findMany();
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



// POST endpoint to create a new appointment
router.post('/', async (req, res) => {
  try {
    const { memberId, staffId, serviceId, facilityId, appointmentDate, appointmentTime, notes } = req.body;

    // Validate input data (you can add more validation as needed)
    if (!memberId || !staffId || !serviceId || !facilityId || !appointmentDate || !appointmentTime) {
      console.error('Missing required fields', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const appointmentDateConverted = convertToDate(appointmentDate);

    // Create the appointment in the database
    const appointment = await prisma.appointment.create({
      data: {
        member_id: parseInt(memberId),
        staff_id: parseInt(staffId),
        service_id: parseInt(serviceId),
        facility_id: parseInt(facilityId),
        appointment_date: appointmentDateConverted,
        appointment_time: appointmentTime,
        notes: notes
      }
    });

    // Return the created appointment
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// PUT update appointment by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedAppointment = req.body;
  try {
    const existingAppointment = await prisma.appointment.findUnique({ where: { appointment_id: parseInt(id) } });
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    const updated = await prisma.appointment.update({ where: { appointment_id: parseInt(id) }, data: updatedAppointment });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE appointment by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({ where: { appointment_id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// PATCH update appointment by ID
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Optionally handle appointmentDate conversion if it's provided in the update
  if (updates.appointmentDate) {
    try {
      updates.appointment_date = convertToDate(updates.appointmentDate);
      delete updates.appointmentDate;  // Remove the original key to prevent confusion
    } catch (error) {
      return res.status(400).json({ error: 'Invalid date format for appointment date' });
    }
  }

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { appointment_id: parseInt(id) },
      data: updates
    });
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.code === 'P2025') {  // Check if the appointment does not exist
      res.status(404).json({ error: 'Appointment not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;