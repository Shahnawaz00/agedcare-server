const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET member by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.member.findUnique({ where: { member_id: parseInt(id) } });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new member
router.post('/', async (req, res) => {
  const newMember = req.body;
  try {
    const createdMember = await prisma.member.create({ data: newMember });
    res.status(201).json(createdMember);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update member by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedMember = req.body;
  try {
    const existingMember = await prisma.member.findUnique({ where: { member_id: parseInt(id) } });
    if (!existingMember) {
      return res.status(404).json({ error: 'Member not found' });
    }
    const updated = await prisma.member.update({ where: { member_id: parseInt(id) }, data: updatedMember });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE member by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.member.delete({ where: { member_id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
