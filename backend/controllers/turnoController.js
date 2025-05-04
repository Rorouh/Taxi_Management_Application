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
        if(turno.fin <= turno.inicio){
            return res.status(400).json({ error: 'Fechas inválidas: fin debe ser posterior al inicio' });
        }
        const tiempo_max = 8 * 60 * 60 * 1000;
        if(turno.fin - turno.inicio > tiempo_max){
            return res.status(400).json({ error: 'Turno demasiado largo' });
        }
        if(turno.inicio < Date.now()){
            return res.status(400).json({ error: 'Turno en el pasado' });
        }
        const turnosConductor = await Turno.find({ conductor: turno.conductor._id });
        for(const turnoConductor of turnosConductor){
            if(turnoConductor.fin > turno.inicio && turnoConductor.inicio < turno.fin){
                return res.status(400).json({ error: 'Conductor ocupado en ese horario' });
            }
        }
        const turnosTaxi = await Turno.find({ taxi: turno.taxi._id });
        for(const turnoTaxi of turnosTaxi){
            if(turnoTaxi.fin > turno.inicio && turnoTaxi.inicio < turno.fin){
                return res.status(400).json({ error: 'Taxi ocupado en ese horario' });
            }
        }
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





