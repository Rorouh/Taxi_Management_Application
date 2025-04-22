const express = require('express');
const router  = express.Router();
const Precio  = require('../models/Precio');

// POST /api/precios
router.post('/', async (req, res) => {
  try {
    const { nivelConfort, precioMinuto, incrementoNocturno } = req.body;
    const p = await Precio.findOneAndUpdate(
      { nivelConfort },
      { precioMinuto, incrementoNocturno },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/precios
router.get('/', async (req, res) => {
  const list = await Precio.find();
  res.json(list);
});

// POST /api/precios/simular
router.post('/simular', async (req, res) => {
  // … implementación de simulación como antes …
});

module.exports = router;