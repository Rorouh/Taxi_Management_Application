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
  try {
    const { inicio, fin, nivelConfort } = req.body;

    const p = await Precio.findOne({ nivelConfort });
    
    const fechaInicial = new Date(inicio);
    const fechaFinal= new Date(fin);
    const minutos = Math.floor((fechaFinal - fechaInicial) / (1000 * 60));

    const precioTotal = (p.precioMinuto * minutos)+ (p.precioMinuto * minutos * p.incrementoNocturno / 100);
    res.status(200).json(precioTotal);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

