const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const precoPorMinutoSchema = new Schema({
    nivelConforto: { type: String, enum: ['básico', 'luxuoso'], required: true },
    preco: { type: Number, required: true },
    percentagem: { type: Number, required: true }
});

module.exports = mongoose.model('precoPorMinuto', precoPorMinutoSchema);
