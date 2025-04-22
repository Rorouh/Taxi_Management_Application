const Precio = require('../models/Precio');

exports.crearOActualizarPrecio = async (req, res) => {
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
};

exports.getPrecios = async (req, res) => {
  try {
    const list = await Precio.find();
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.simularPrecio = async (req, res) => {
  res.json({ mensaje: 'Simulación no implementada todavía' });
};

