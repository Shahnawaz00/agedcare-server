const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany();
    res.json(appointments);
  } catch (error) {
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

const convertToDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day).toISOString();
};
// POST create new appointment
router.post('/', async (req, res) => {
  const { memberId, staffId, serviceId, facilityId, appointmentDate, appointmentTime, notes } = req.body;
  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        member_id: parseInt(memberId),
        staff_id: parseInt(staffId),
        service_id: parseInt(serviceId),
        facility_id: parseInt(facilityId),
        appointment_date: new Date(appointmentDate),
        appointment_time: appointmentTime,
        notes: notes || null,
      },
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
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

module.exports = router;