const Taxi = require('../models/taxi');

function validarMatricula(matricula) {
    const regex = /^[A-Z]{2}-\d{2}-[A-Z]{2}$/;
    return regex.test(matricula);
}
exports.createTaxi = async (req, res) => {
    try {
        const { matricula, anoDeCompra, marca, modelo, nivelDeConforto } = req.body;
        if(!validarMatricula(matricula)){
            return res.status(400).json({ error: 'Matricula inválida' });
        }
        const anoActual = new Date().getFullYear();
        if (anoDeCompra > anoActual) {
            return res.status(400).json({ error: 'Ano de compra inválido' });
        }
        if (nivelDeConforto != 'básico' && nivelDeConforto != 'luxuoso') {
            return res.status(400).json({ error: 'Nivel de conforto inválido' });
        }
        matricula = matricula.toUpperCase();
        const taxi = new Taxi({ matricula, anoDeCompra, marca, modelo, nivelDeConforto });
        await taxi.save();
        res.status(201).json(taxi);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTaxis = async (req, res) => {
    try {
        const taxis = await Taxi.find().sort({ criado: -1 });
        res.json(taxis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

