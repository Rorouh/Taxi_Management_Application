const mongoose = require('mongoose');
const cliente = require('./cliente');

const Schema = mongoose.Schema;

const faturaSchema = new Schema({
    numero: { type: Number, required: true, unique: true },
    viagem: { type: Schema.Types.ObjectId, ref: 'viagem', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'cliente', required: true },
    data: { type: Date, required: true }
});

module.exports = mongoose.model('fatura', faturaSchema);