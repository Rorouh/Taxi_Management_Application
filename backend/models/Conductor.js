const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  nif: {
    type: String,
    required: true,
    match: [/^\d{9}$/, 'El NIF debe tener 9 dígitos']
  },
  nombre:        { type: String, required: true },
  genero:        { type: String, enum: ['femenino','masculino'], required: true },
  anoNacimiento: {
    type: Number,
    required: true,
    validate: {
      validator: v => v <= new Date().getFullYear() - 18,
      message: 'El conductor debe tener al menos 18 años'
    }
  },
  direccion: {
    calle:        String,
    numero:       String,
    codigoPostal: String,
    localidad:    String
  },
  licencia:      { type: String, required: true },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conductor', conductorSchema);
