const express = require('express');
const router  = express.Router();
const Taxi    = require('../models/Taxi');

// POST /api/taxis
router.post('/', async (req, res) => {
  try {
    const t = new Taxi(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/taxis
router.get('/', async (req, res) => {
  const list = await Taxi.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;