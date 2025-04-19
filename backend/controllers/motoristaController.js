const Motorista = require('../models/motorista');
const cp = require('../data/codigos_postais.json');

const createMotorista = async (req, res) => {
    try {
        const { nif, nome, genero, anoDeNascimento, cartaDeConducao, morada } = req.body;
        
        if(anoDeNascimento + 18 > new Date().getFullYear()) {
            return res.status(400).json({ error: 'Idade inválida' });
        }
        if(!/^\d{9}$/.test(nif)) {	
            return res.status(400).json({ error: 'Nif inválido' });
        }
        //RIA 11 y 12 en esquema
        if(cp[morada.codigoPostal] == null) {
            return res.status(400).json({ error: 'Código postal inválido' });
        }
        
        morada.localidade = cp[morada.codigoPostal];
        
        const motorista = new Motorista({ nif, nome, genero, anoDeNascimento, cartaDeConducao, morada });
        await motorista.save();
        res.status(201).json(motorista);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getMotoristas = async (req, res) => {
    try {
        const motoristas = await Motorista.find().sort({ criado: -1 });
        res.status(200).json(motoristas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createMotorista, getMotoristas };