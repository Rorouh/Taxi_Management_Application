const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const motoristaSchema = new Schema({
    nif: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    genero: { type: String, enum: ['masculino', 'feminino'], required: true },
    anoDeNascimento: { type: Number, required: true},
    cartaDeConducao: { type: String, required: true, unique: true },
    morada: { 
        rua: { type: String, required: true },
        numeroDaPorta: { type: String, required: true },
        codigoPostal: { type: String, required: true },
        localidade: { type: String, required: true }
     },
    criado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('motorista', motoristaSchema);