const mongoose = require('mongoose');

const acessoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  data: { type: Date, default: Date.now },
  sucesso: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Acesso', acessoSchema);
