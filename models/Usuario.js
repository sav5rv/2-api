const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Função para obter a data e hora no fuso horário de São Paulo
function obterDataHoraSaoPaulo() {
  const agora = new Date();
  const offset = -3; // Fuso horário de São Paulo (UTC-3)
  const dataSaoPaulo = new Date(agora.getTime() + offset * 60 * 60 * 1000);
  return dataSaoPaulo;
}

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  status: { type: String, default: 'ativo' },
  perfil: { type: String, default: 'usuario'},
  criadoEm: { type: Date }
}, {
    timestamps: {
      createdAt: 'criadoEm', //renomeia o campo createdAt
      updatedAt: 'atualizadoEm', 
      currentTime: obterDataHoraSaoPaulo //funçao personalizada que define dt/hr
    }
  }
);

// Middleware para hash de senha e configuração de data antes de salvar
usuarioSchema.pre('save', async function (next) {
  // Hash da senha se ela foi modificada
  if (!this.isModified('senha')) return next();
  this.senha = await bcryptjs.hash(this.senha, 10);
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);
