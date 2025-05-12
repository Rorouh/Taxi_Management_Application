const Viaje = require('../models/Viaje');
const Pedido = require('../models/Pedido');
const Turno = require('../models/turno');
const Conductor = require('../models/Conductor');

exports.getViajes = async (req, res) => {
    try{
        const viajes = await Viaje.find();
        res.json(viajes);
    }catch(e){
        res.status(400).json({ error: e.message });
    }

}

exports.createViaje = async (req, res) => {
    try{
        const viaje = new Viaje(req.body);
        await viaje.save();
        res.json(viaje);
    }catch(e){
        res.status(400).json({ error: e.message });
    }
}


exports.getViajeIdPedido = async (req, res) => {
    try {
        const viaje = await Viaje.findOne({ pedido: req.params.id })
        .populate({
            path: 'pedido',
            populate: { path: 'cliente' }
        })
        .populate({
            path: 'turno',
            populate: [
            { path: 'conductor' },
            { path: 'taxi' }
            ]
        });
        res.json(viaje);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getViajeID = async (req, res) => {
    try {
      const viaje = await Viaje.findById(req.params.id)
        .populate({
            path: 'pedido',
            populate: { path: 'cliente' }
        })
        .populate({
            path: 'turno',
            populate: [
                { path: 'conductor' },
                { path: 'taxi' }
            ]
        });
      res.status(200).json(viaje);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
};


exports.finalizarViaje = async (req, res) => {
    try {
        const { fin, kilometros, precio } = req.body;
        const viaje = await Viaje.findById(req.params.id).populate('pedido');
        if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });

        viaje.fin        = fin ? new Date(fin) : new Date();
        viaje.kilometros = kilometros ?? viaje.kilometros;
        viaje.precio     = precio     ?? viaje.precio;
        await viaje.save();

        viaje.pedido.estado = 'completado';
        await viaje.pedido.save();

        res.json(viaje);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
};

exports.getViajesConductor = async (req, res) => {
  try {
        const { nif } = req.params;

        const conductor = await Conductor.findOne({ nif });
        if (!conductor) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
        }

        const turnos = await Turno.find({ conductor: conductor._id });
        const turnoIds = turnos.map(t => t._id);

        const viajes = await Viaje.find({ turno: { $in: turnoIds } })
        .sort({ inicio: -1 }) 
        .populate({
            path: 'pedido',
            match: { estado: 'completado' },
            populate: { path: 'cliente' }
        })
        .populate({
            path: 'turno',
            populate: [
            { path: 'conductor' },
            { path: 'taxi' }
            ]
        });

        const resultado = viajes.filter(v => v.pedido && v.turno && v.turno.conductor);

        res.json(resultado);
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: 'Error interno del servidor' });
    }
};
