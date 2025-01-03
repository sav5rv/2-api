const Acesso = require('../models/Acesso');
const Usuario = require('../models/Usuario');

exports.registrarAcesso = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Obter IP e Nome da Máquina
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const maquina = req.headers['user-agent'] || 'Desconhecido';

        // Verifica se o usuário existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
        // Registra acesso sem sucesso
        await Acesso.create({ usuarioId: null, sucesso: false });
        return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        // Verifica a senha
        const bcrypt = require('bcrypt');
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
        // Registra acesso sem sucesso
        await Acesso.create({ usuarioId: usuario._id, sucesso: false });
        return res.status(401).json({ erro: 'Senha incorreta' });
        }

        // Registra acesso com sucesso
        await Acesso.create({ usuarioId: usuario._id, sucesso: true, ip, maquina });
        res.status(200).json({ mensagem: 'Acesso bem-sucedido!', usuario: usuario.nome });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao registrar acesso', detalhes: err.message });
    }
};

exports.obterAcessos = async (req, res) => {
  try {
    const acessos = await Acesso.find().populate('usuarioId', 'nome email');
    res.json(acessos);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao obter acessos', detalhes: err.message });
  }
};

exports.listarTodosAcessos = async (req, res) => {
    try {
      const acessos = await Acesso.find().populate('usuarioId', 'nome email').sort({ data: -1 });
      res.json(acessos);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar acessos', detalhes: err.message });
    }
  };
  
  exports.listarAcessosUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const acessos = await Acesso.find({ usuarioId: id }).populate('usuarioId', 'nome email').sort({ data: -1 });
      if (!acessos.length) return res.status(404).json({ erro: 'Nenhum acesso encontrado para este usuário' });
      res.json(acessos);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar acessos do usuário', detalhes: err.message });
    }
  };