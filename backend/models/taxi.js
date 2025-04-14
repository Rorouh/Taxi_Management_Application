const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taxiSchema = new Schema({
    matricula: { type: String, required: true, unique: true },
    anoDeCompra: { type: String, required: true, },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    nivelDeConforto: { type: String,enum: ['básico', 'luxuoso'], required: true },
    criado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('taxi', taxiSchema);
