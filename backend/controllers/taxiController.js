const Taxi = require('../models/Taxi');

exports.createTaxi = async (req, res) => {
    try {
        const { matricula, anoCompra, marca, modelo, nivelConfort } = req.body; 
        const taxi = new Taxi({ matricula, anoCompra, marca, modelo, nivelConfort});
        await taxi.save();
        res.status(201).json(taxi);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTaxis = async (req, res) => {
    try {
        const taxis = await Taxi.find().sort({ createdAt: -1 });
        res.json(taxis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



