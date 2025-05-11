const Turno = require('../models/Turno');
const Conductor = require('../models/Conductor');
const Taxi = require('../models/Taxi');


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
        const { conductor, taxi, inicio, fin } = req.body;
        const inicioDate = new Date(inicio);
        const finDate = new Date(fin);

        const turno = new Turno({
            conductor,
            taxi,
            inicio: inicioDate,
            fin: finDate,
        });

        const turnosConductor = await Turno.find({ conductor: turno.conductor });
        for(const turnoConductor of turnosConductor){
            if(turnoConductor.fin > turno.inicio && turnoConductor.inicio < turno.fin){
                return res.status(400).json({ error: 'Conductor ocupado en ese horario' });
            }
        }
        const turnosTaxi = await Turno.find({ taxi: turno.taxi });
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

exports.getTurnosConductor = async (req, res) => {
    try {
        const conductor = await Conductor.findOne({ nif: req.params.nif });
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        const turnos = await Turno.find({ conductor: conductor._id }).populate('conductor').populate('taxi').sort({ inicio: 1 });
        res.status(200).json(turnos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTaxisDisponibles = async (req, res) => {
    try {
        const { inicio, fin } = req.body;
        const inicioDate = new Date(inicio);
        const finDate = new Date(fin);

        if(inicioDate < Date.now()){
            return res.status(400).json({ error: 'Turno en el pasado' });
        }
        if(finDate <= inicioDate){
            return res.status(400).json({ error: 'Fechas inválidas: fin debe ser posterior al inicio' });
        }
        const tiempo_max = 8 * 60 * 60 * 1000;
        if(finDate - inicioDate > tiempo_max){
            return res.status(400).json({ error: 'Turno demasiado largo' });
        }

        const taxis = await Taxi.find({});
        const taxisDisponibles = [];
        for(const taxi of taxis){
            const turnosTaxi = await Turno.find({ taxi: taxi._id });
            let ocupado = false;
            for(const turnoTaxi of turnosTaxi){
                if(turnoTaxi.fin > inicioDate && turnoTaxi.inicio < finDate){
                    ocupado = true;
                    break;
                }
            }
            if(!ocupado){
                taxisDisponibles.push(taxi);
            }
        }
        res.status(200).json(taxisDisponibles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};





