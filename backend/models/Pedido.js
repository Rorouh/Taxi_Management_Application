const mongoose = require('mongoose');
const Cliente = require('./cliente');
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
  estado: { type: String, enum: ['pendiente', 'en progreso', 'completado', 'cancelado'], required: true },
  conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'Conductor', required: true },
  distancia: { type: Number, required: true, min: 0 },
  taxi: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxi', required: true },
  tiempo: { type: Number, required: true, min: 0 },
  costo: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Pedido', pedidoSchema);

