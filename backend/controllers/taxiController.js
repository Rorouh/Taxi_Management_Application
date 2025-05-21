const Taxi = require('../models/taxi');
const Turno = require('../models/Turno');

exports.createTaxi = async (req, res) => {
    try {
        const { matricula, anoCompra, marca, modelo, nivelConfort } = req.body; 
        const taxi = new Taxi({ matricula, anoCompra, marca, modelo, nivelConfort});
        await taxi.save();
        res.status(201).json(taxi);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Matricula ya existente' });
        }
        else{
            res.status(400).json({ error: error.message });
        }
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


exports.updateTaxi = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        updates.createdAt = new Date();
        const taxi = await Taxi.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
        if (!taxi) {
            return res.status(404).json({ error: 'Taxi no encontrado' });
        }

        res.json(taxi);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Matricula ya existente' });
        }
        else{
            res.status(400).json({ error: error.message });
        }
    }
};

exports.deleteTaxi = async (req, res) => {
    try {
        const { id } = req.params;
        const turno = await Turno.findOne({ taxi: id });

        if (turno) {
            return res.status(400).json({ error: 'Existe un turno asociado, no se puede borrar' });
        }

        const deleted = await Taxi.findByIdAndDelete(id);
        if (!deleted) {
        return res.status(404).json({ error: 'Taxi no encontrado' });
        }
        res.json({ message: 'Taxi eliminado' });

    } catch (err) {
        console.error('ERROR deleteTaxi:', err);
        res.status(400).json({ error: err.message });
    }
};

