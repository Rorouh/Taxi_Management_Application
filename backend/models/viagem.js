const mongoose = require('mongoose');
const precoPorMinuto = require('./Precio');
const morada = require('./morada');

const Schema = mongoose.Schema;

const viagemSchema = new Schema({
    Sequencia: { type: String, required: true, unique: true },
    NumeroDePersonas: { type: Number, required: true },
    turno: { type: Schema.Types.ObjectId, ref: 'turno', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'cliente', required: true },
    casaPartida: { type: Schema.Types.ObjectId, ref: 'morada', required: true },
    casaDestino: { type: Schema.Types.ObjectId, ref: 'morada', required: true },
    inicio: { type: Date, required: true },
    fin: { type: Date, required: true },
    precio: { type: Number, required: true },
    kilometros: { type: Number, required: true },

});

module.exports = mongoose.model('viagem', viagemSchema);