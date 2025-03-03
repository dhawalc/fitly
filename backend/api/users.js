const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

// GET user by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get user with ID: ${req.params.id}` });
});

// POST new user
router.post('/', (req, res) => {
  res.json({ message: 'Create new user', data: req.body });
});

// PUT update user
router.put('/:id', (req, res) => {
  res.json({ message: `Update user with ID: ${req.params.id}`, data: req.body });
});

// DELETE user
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete user with ID: ${req.params.id}` });
});

module.exports = router; 