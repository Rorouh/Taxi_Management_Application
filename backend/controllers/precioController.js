
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
    // 1) Obtén la configuración
    const cfg = await Precio.findOne({ nivelConfort });
    if (!cfg) {
      return res.status(404).json({ error: 'Nivel de confort no configurado' });
    }

    // 2) Valida fechas
    const start = new Date(inicio);
    const end   = new Date(fin);
    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ error: 'Fechas inválidas: fin debe ser posterior al inicio' });
    }

    // 3) Cálculo por segmentos
    const minutosEntre = (a, b) => (b - a) / 60000;
    let total = 0;
    let cursor = new Date(start);

    while (cursor < end) {
      const hora = cursor.getHours() + cursor.getMinutes()/60;
      let next = new Date(cursor);

      if (hora >= 6 && hora < 21) {
        next.setHours(21,0,0,0);
      } else {
        if (hora < 6) {
          next.setHours(6,0,0,0);
        } else {
          next.setDate(next.getDate()+1);
          next.setHours(6,0,0,0);
        }
      }

      const tramoFin = next < end ? next : end;
      const mins = minutosEntre(cursor, tramoFin);

      const isNocturno = (hora < 6 || hora >= 21);
      const tarifaMin = cfg.precioMinuto * (isNocturno ? (1 + cfg.incrementoNocturno) : 1);
      total += mins * tarifaMin;

      cursor = tramoFin;
    }

    // 4) Devuelve el coste con dos decimales
    res.json({ coste: parseFloat(total.toFixed(2)) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
