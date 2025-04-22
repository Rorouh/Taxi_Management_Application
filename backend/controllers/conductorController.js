const cp = require('../data/codigos_postais.json');
const Conductor = require('../models/Conductor');

exports.createConductor = async (req, res) => {
    try {
        const { nif, nombre, genero, anoNacimiento, direccion, licencia } = req.body;

        if(cp[direccion.codigoPostal] == null) {
            return res.status(400).json({ error: 'Código postal inválido' });
        }
        
        direccion.localidad = cp[direccion.codigoPostal];
        
        const conductor = new Conductor({ nif, nombre, genero, anoNacimiento, direccion, licencia });
        await conductor.save();
        res.status(201).json(conductor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getConductores = async (req, res) => {
    try {
        const conductores = await Conductor.find().sort({ createdAt: -1 });
        res.status(200).json(conductores);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
