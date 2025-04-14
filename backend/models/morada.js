const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moradaSchema = new Schema({
    id: { type: String, required: true, unique: true },
    rua: { type: String, required: true },
    numeroDaPorta: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    localidade: { type: String, required: true }
});

module.exports = mongoose.model('morada', moradaSchema);