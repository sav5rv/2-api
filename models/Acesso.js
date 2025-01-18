const mongoose = require('mongoose');

// Função para obter a data e hora no fuso horário de São Paulo
function obterDataHoraSaoPaulo() {
  const agora = new Date();
  const offset = -3; // Fuso horário de São Paulo (UTC-3)
  const dataSaoPaulo = new Date(agora.getTime() + offset * 60 * 60 * 1000);
  return dataSaoPaulo;
}

const acessoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  data: { type: Date, default: Date.now },
  sucesso: { type: Boolean, default: true },
  ip: { type: String, required: true },
  maquina: { type: String, required: true },
}, {
  timestamps: {
    createdAt: 'criadoEm', //renomeia o campo createdAt
    updatedAt: 'atualizadoEm', 
    currentTime: obterDataHoraSaoPaulo //funçao personalizada que define dt/hr
  }
}
);

module.exports = mongoose.model('Acesso', acessoSchema);
