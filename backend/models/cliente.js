const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nif: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    genero: { type: String, enum: ['masculino', 'feminino'], required: true },
});

module.exports = mongoose.model('cliente', clienteSchema);