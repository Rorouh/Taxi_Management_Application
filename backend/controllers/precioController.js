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
    const { nivelConfort, inicio, fin } = req.body;

    const cfg = await Precio.findOne({ nivelConfort });
    if (!cfg) {
      return res.status(404).json({ error: 'Nivel de confort no configurado' });
    }

    const start = new Date(inicio);
    const end   = new Date(fin);
    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ error: 'Fechas inválidas: fin debe ser posterior al inicio' });
    }

    // Función auxiliar para minutos entre dos instantes
    const minutosEntre = (a, b) => (b - a) / 60000;

    let total = 0;
    let cursor = new Date(start);

    // Convertimos el incremento de porcentaje a fracción (p.ej. 20 → 0.20)
    const incFrac = cfg.incrementoNocturno / 100;

    while (cursor < end) {
      const horaDec = cursor.getHours() + cursor.getMinutes() / 60;
      const next = new Date(cursor);

      // Calculamos el siguiente cambio de tarifa (6:00 o 21:00)
      if (horaDec >= 6 && horaDec < 21) {
        next.setHours(21, 0, 0, 0);
      } else if (horaDec < 6) {
        next.setHours(6, 0, 0, 0);
      } else {
        // horaDec ≥ 21 → pasar al día siguiente a las 6:00
        next.setDate(next.getDate() + 1);
        next.setHours(6, 0, 0, 0);
      }

      const tramoFin = next < end ? next : end;
      const mins = minutosEntre(cursor, tramoFin);

      const nocturno = horaDec < 6 || horaDec >= 21;
      const tarifaMin = cfg.precioMinuto * (nocturno ? (1 + incFrac) : 1);
      total += mins * tarifaMin;

      cursor = tramoFin;
    }

    res.json({ coste: parseFloat(total.toFixed(2)) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
