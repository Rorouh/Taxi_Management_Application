const mongoose = require('mongoose');
const Pedido = require('./Pedido');
const Turno = require('./Turno');


const viajeSchema = new mongoose.Schema({
    pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
    turno: { type: mongoose.Schema.Types.ObjectId, ref: 'Turno', required: true },
    distanciaCliente: { type: Number, required: true },
    tiempototal: { type: Number, required: true },
    inicio : { type: Date, required: true },
    fin : { type: Date, required: true }
});


