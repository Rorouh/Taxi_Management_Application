const Viaje = require('../models/Viaje');

exports.getViajes = async (req, res) => {
    const viajes = await Viaje.find();
    res.json(viajes);
}

exports.createViaje = async (req, res) => {
    const viaje = new Viaje(req.body);
    await viaje.save();
    res.json(viaje);
}