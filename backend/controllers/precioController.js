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
    const { horaInicio, horaFin, nivelConfort } = req.body;

    const p = await Precio.findOne({ nivelConfort });
    
    if (horaInicio > horaFin) {
      return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' });
    }

    const duracion = (horaFin - horaInicio) / 60;
    const precioTotal = (p.precioMinuto * duracion)+ (p.precioMinuto * duracion * p.incrementoNocturno / 100);
    res.status(200).json(precioTotal);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

