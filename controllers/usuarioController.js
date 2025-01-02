const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuario = new Usuario({ nome, email, senha });
    await usuario.save();
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar usuário', detalhes: err.message });
  }
};

exports.trocarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) return res.status(400).json({ erro: 'Senha atual incorreta' });

    usuario.senha = novaSenha;
    await usuario.save();
    res.json({ mensagem: 'Senha alterada com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao trocar senha', detalhes: err.message });
  }
};

// Outros métodos serão adicionados aqui.
