const cp = require('../data/codigos_postais.json');
const Conductor = require('../models/Conductor');

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
}
