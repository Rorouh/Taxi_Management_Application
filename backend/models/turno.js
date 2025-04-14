const mongoose = require('mongoose');
const motorista = require('./motorista');
const { init } = require('./taxi');

const Schema = mongoose.Schema;

const turnoSchema = new Schema({
    taxi: { type: Schema.Types.ObjectId, ref: 'taxi', required: true },
    motorista: { type: Schema.Types.ObjectId, ref: 'motorista', required: true },
    inicio: { type: Date, required: true },
    fim: { type: Date, required: true },
});

module.exports = mongoose.model('turno', turnoSchema);