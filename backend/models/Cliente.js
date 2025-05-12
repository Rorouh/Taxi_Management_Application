const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nif: {
    type: String,
    required: true,
    match: [/^\d{9}$/, 'El NIF debe tener 9 dígitos'],
    unique: true
  },
  nombre: { type: String, required: true },
  genero: { type: String, enum: ['femenino','masculino'], required: true },
  direccion: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    localidad: { type: String}
  },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', clienteSchema);
