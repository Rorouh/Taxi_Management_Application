const Viaje = require('../models/Viaje');

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