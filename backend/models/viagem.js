const mongoose = require('mongoose');
const { init } = require('./taxi');
const precoPorMinuto = require('./precoPorMinuto');
const morada = require('./morada');

const Schema = mongoose.Schema;

const viagemSchema = new Schema({
    Sequencia: { type: String, required: true, unique: true },
    NumeroDePessoas: { type: Number, required: true },
    turno: { type: Schema.Types.ObjectId, ref: 'turno', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'cliente', required: true },
    moradaPartida: { type: Schema.Types.ObjectId, ref: 'morada', required: true },
    moradaDestino: { type: Schema.Types.ObjectId, ref: 'morada', required: true },
    inicio: { type: Date, required: true },
    fim: { type: Date, required: true },
    preco: { type: Number, required: true },
    quilometros: { type: Number, required: true },

});

module.exports = mongoose.model('viagem', viagemSchema);