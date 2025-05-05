const mongoose = require('mongoose');
const Conductor = require('./Conductor');
const Taxi = require('./taxi');

const Schema = mongoose.Schema;

const turnoSchema = new Schema({
    taxi: { type: Schema.Types.ObjectId, ref: 'Taxi', required: true },
    conductor: { type: Schema.Types.ObjectId, ref: 'Conductor', required: true },
    inicio: { type: Date, required: true },
    fin: { type: Date, required: true },
});

module.exports = mongoose.model('turno', turnoSchema);