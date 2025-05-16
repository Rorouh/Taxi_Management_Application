// controllers/reportController.js
const Viaje = require('../models/Viaje');
const Turno = require('../models/turno');
const Conductor = require('../models/Conductor');
const Taxi = require('../models/taxi');

function parseRange(query) {
  // rango por defecto: día de hoy
  const hoy = new Date();
  const inicio = query.inicio
    ? new Date(query.inicio)
    : new Date(hoy.setHours(0, 0, 0, 0));
  const fin = query.fin
    ? new Date(query.fin)
    : new Date(hoy.setHours(23, 59, 59, 999));
  return { inicio, fin };
}

// GET /reportes/totales?inicio=&fin=
exports.getTotales = async (req, res) => {
  try {
    const { inicio, fin } = parseRange(req.query);
    const viajes = await Viaje.find({ inicio: { $gte: inicio, $lte: fin } });
    const totalViajes = viajes.length;
    let totalHoras = 0, totalKm = 0;
    viajes.forEach(v => {
      totalHoras += (v.fin - v.inicio) / 3600000;
      totalKm    += v.distanciaCliente;
    });
    res.json({ totalViajes, totalHoras, totalKm });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /reportes/subtotales/:tipo?inicio=&fin=
exports.getSubtotales = async (req, res) => {
  try {
    const { tipo } = req.params; // 'viajes' | 'horas' | 'km'
    const { inicio, fin } = parseRange(req.query);
    const viajes = await Viaje.find({ inicio: { $gte: inicio, $lte: fin } })
      .populate({ path: 'turno', populate: ['conductor','taxi'] });

    const mapC = new Map(), mapT = new Map();
    viajes.forEach(v => {
      const keyC = v.turno.conductor._id.toString();
      const keyT = v.turno.taxi._id.toString();
      let valor = tipo === 'viajes' ? 1
                : tipo === 'horas'   ? (v.fin - v.inicio)/3600000
                :                     v.distanciaCliente;

      if (!mapC.has(keyC)) mapC.set(keyC, { conductor: v.turno.conductor, valor: 0 });
      mapC.get(keyC).valor += valor;

      if (!mapT.has(keyT)) mapT.set(keyT, { taxi: v.turno.taxi, valor: 0 });
      mapT.get(keyT).valor += valor;
    });

    const conductores = Array.from(mapC.values())
      .sort((a,b) => b.valor - a.valor);
    const taxis = Array.from(mapT.values())
      .sort((a,b) => b.valor - a.valor);

    res.json({ conductores, taxis });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /reportes/detalles/:tipo/:entidad/:id?inicio=&fin=
// entidad = 'conductor' | 'taxi'
exports.getDetalles = async (req, res) => {
  try {
    const { tipo, entidad, id } = req.params;
    const { inicio, fin } = parseRange(req.query);
    const viajes = await Viaje.find({ inicio: { $gte: inicio, $lte: fin } })
      .populate({ path: 'turno', populate: ['conductor','taxi'] });

    const detalles = viajes
      .filter(v => {
        const doc = entidad === 'conductor'
          ? v.turno.conductor._id.toString()
          : v.turno.taxi._id.toString();
        return doc === id;
      })
      .map(v => {
        const base = { viajeId: v._id, inicio: v.inicio, fin: v.fin };
        if (tipo === 'viajes') return base;
        if (tipo === 'horas') return { ...base, horas: (v.fin - v.inicio)/3600000 };
        if (tipo === 'km')    return { ...base, km: v.distanciaCliente };
      })
      .sort((a,b) => {
        if (tipo === 'viajes')   return b.fin - a.fin;
        const campo = tipo === 'horas' ? 'horas' : 'km';
        return b[campo] - a[campo];
      });

    res.json(detalles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
