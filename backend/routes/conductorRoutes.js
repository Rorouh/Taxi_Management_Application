const express   = require('express');
const router    = express.Router();
const Conductor = require('../models/Conductor');

// POST /api/conductores
router.post('/', async (req, res) => {
  try {
    const c = new Conductor(req.body);
    await c.save();
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/conductores
router.get('/', async (req, res) => {
  const list = await Conductor.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;