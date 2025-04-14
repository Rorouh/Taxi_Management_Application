const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const motoristaSchema = new Schema({
    nif: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    genero: { type: String, enum: ['masculino', 'feminino'], required: true },
    anoDeNascimento: { type: Number, required: true},
    cartaDeConducao: { type: String, required: true, unique: true },
    morada: { type: Schema.Types.ObjectId, ref: 'morada', required: true },
});

module.exports = mongoose.model('motorista', motoristaSchema);