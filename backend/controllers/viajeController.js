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
// controllers/viajeController.js

exports.finalizarViaje = async (req, res) => {
    try {
      const { fin, kilometros, precio } = req.body;
      const viaje = await Viaje.findById(req.params.id).populate('pedido');
      if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });
  
      // Eliminamos la validación de "si viaje.fin ya existe"
      // viaje.fin siempre existe para la fecha prevista,
      // así que simplemente actualizamos con la hora real y km.
      viaje.fin        = fin ? new Date(fin) : new Date();
      viaje.kilometros = kilometros ?? viaje.kilometros;
      viaje.precio     = precio     ?? viaje.precio;
      await viaje.save();
  
      // Cambiamos el estado del pedido a 'completado'
      viaje.pedido.estado = 'completado';
      await viaje.pedido.save();
  
      res.json(viaje);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };
  