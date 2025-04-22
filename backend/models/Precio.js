
const mongoose = require('mongoose');

const precioSchema = new mongoose.Schema({
  nivelConfort: {
    type: String,
    enum: ['basico','lujoso'],
    required: true,
    unique: true
  },
  precioMinuto: {
    type: Number,
    required: true,
    min: [0, 'El precio por minuto debe ser positivo']
  },
  incrementoNocturno: {
    type: Number,
    required: true,
    min: [0, 'El incremento nocturno no puede ser negativo']
  }
});

module.exports = mongoose.model('Precio', precioSchema);
