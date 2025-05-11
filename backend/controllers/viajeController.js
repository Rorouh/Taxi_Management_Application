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

//Storry 8
exports.finalizarViaje = async (req, res) => {
    try {
      const { fin, kilometros, precio } = req.body;   // datos que llega del front
      const viaje  = await Viaje.findById(req.params.id).populate('pedido');
      if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });
  
      // solo se puede cerrar una vez
      if (viaje.fin) return res.status(400).json({ error: 'El viaje ya está finalizado' });
  
      viaje.fin        = fin ? new Date(fin) : new Date(); // si no mandan fecha usamos ahora
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