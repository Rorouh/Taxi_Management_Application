const mongoose = require('mongoose');
const Cliente = require('./Cliente');
const Conductor = require('./Conductor');
const taxi = require('./taxi');

const pedidoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  origen: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    localidad: { type: String},
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true }
  }, 
  destino:{
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    localidad: { type: String},
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true }
  },
  numPersonas: { type: Number, required: true, min: 1 },
  estado: { type: String, enum: ['pendiente', 'aceptado', 'en progreso', 'completado', 'cancelado'], required: true },
  confort: { type: String, enum: ['basico','lujoso'], required: true },
  distancia: { type: Number, required: true },
  tiempo: { type: Number, required: true }
});

module.exports = mongoose.model('Pedido', pedidoSchema);

