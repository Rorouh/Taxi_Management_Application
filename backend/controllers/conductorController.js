const cp = require('../data/codigos_postais.json');
const Conductor = require('../models/Conductor');
const Turno = require('../models/Turno');
exports.createConductor = async (req, res) => {
    try {
        const { nif, nombre, genero, anoNacimiento, direccion, licencia } = req.body;
        const conductor = new Conductor({ nif, nombre, genero, anoNacimiento, direccion, licencia });
        await conductor.save();
        res.status(201).json(conductor);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.nif) {
            return res.status(400).json({ error: 'NIF ya existente' });
        }
        else if (error.code === 11000 && error.keyPattern.licencia) {
            return res.status(400).json({ error: 'Licencia ya existente' });
        }
        else{
           return res.status(400).json({ error: error.message });
        }
    }
};


exports.getConductores = async (req, res) => {
    try {
        const conductores = await Conductor.find().sort({ createdAt: -1 });
        res.status(200).json(conductores);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getConductorNIF = async (req, res) => {
    try {
        const conductor = await Conductor.findOne({ nif: req.params.nif });
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        res.status(200).json(conductor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.updateConductor = async (req, res) => {
    try {
        const { nif } = req.params;
        const updates = { ...req.body };
        updates.createdAt = new Date();
        
        const conductor = await Conductor.findOneAndUpdate(
            { nif },
            updates,
            { new: true, runValidators: true }
        );
        if (!conductor) {
            return res.status(400).json({ error: 'Conductor no encontrado' });
        }
        res.status(200).json(conductor);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.nif) {
            return res.status(400).json({ error: 'NIF ya existente' });
        }
        else if (error.code === 11000 && error.keyPattern.licencia) {
            return res.status(400).json({ error: 'Licencia ya existente' });
        }
        else{
           return res.status(400).json({ error: error.message });
        }
    }
};
  
exports.deleteConductor = async (req, res) => {
    try {
        const { nif } = req.params;
        const conductor = await Conductor.findOne({ nif: nif });
        const turnoConTaxi = await Turno.findOne({ 
            conductor: conductor._id,
            taxi: {$ne: null}
         });

        if (turnoConTaxi) {
            return res.status(400).json({ error: 'Existe un turno asociado, no se puede borrar' });
        }
        await Conductor.deleteOne({ nif });
        res.status(200).json({ message: 'Conductor eliminado' });

    } catch (err) {
        console.error('ERROR deleteConductor:', err);
        res.status(400).json({ error: err.message });
    }
};