const Turno = require('../models/turno');
const Conductor = require('../models/Conductor');
const Taxi = require('../models/taxi');

exports.getTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find();
        res.status(200).json(turnos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createTurno = async (req, res) => {
    try {
        const turno = new Turno(req.body);
        
        await turno.save();
        res.status(201).json(turno);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTurnoConductor = async (req, res) => {
    try {
        const conductor = await Conductor.findOne({ nif: req.params.nif });
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        const turnos = await Turno.find({ conductor: conductor._id });
        res.status(200).json(turnos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export.getTaxisDisponibles = async (req, res) => {
    try {
        const { inicio, fin } = req.body;
        const taxisOcupados = await Turno.find({ inicio, fin }); 
        res.status(200).json(taxis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

