const mongoose = require('mongoose');

const taxiSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^[A-Z]{2}-\d{2}-[A-Z]{2}$/.test(v),
      message: props => `${props.value} no es una matrícula válida`
    }
  },
  anoCompra: {
    type: Number,
    required: true,
    max: [new Date().getFullYear(), 'El año de compra no puede superar el actual']
  },
  marca:          { type: String, required: true },
  modelo:         { type: String, required: true },
  nivelConfort:  { type: String, enum: ['basico','lujoso'], required: true },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Taxi', taxiSchema);
