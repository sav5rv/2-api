require('dotenv').config();
const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Usuário ou Senha inválida.' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Usuário ou Senha inválida.' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, mensagem: 'Login bem-sucedido.' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao realizar login.', erro: err.message });
    }
};


exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao listar usuários', detalhes: err.message });
  }
};

exports.obterUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.status(200).json(usuario);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao obter usuário', detalhes: err.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { nome, email, senha },
      { new: true, runValidators: true }
    );
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!', usuario });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar usuário', detalhes: err.message });
  }
};

exports.removerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.status(200).json({ mensagem: 'Usuário removido com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao remover usuário', detalhes: err.message });
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

exports.recuperarSenha = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    // Gerar o token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Simulando envio de email
    // console.log(`Link para redefinir senha: http://localhost:3000/usuarios/redefinir-senha/${token}`);

    // Configurar o transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // gmail é o mais fácil
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // false para TLS (STARTTLS)
      auth: {
        user: process.env.SMTP_USER, // Seu e-mail
        pass: process.env.SMTP_PASS, // Sua senha ou App Password
      },
    });

    // Criar o link de redefinição de senha
    const link = `http://localhost:3000/usuarios/redefinir-senha/${token}`;

    // Configurar o e-mail
    const mailOptions = {
      from: process.env.SMTP_USER, // Remetente
      to: email, //Destinatário
      //to: 'fidorid914@gholar.com',
      subject: 'Recuperação de Senha',
      html: `<p>Olá,</p>
              <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir:</p>
              <a href="${link}">${link}</a>
              <p>Este link é válido por 1 hora.</p>`,
    };

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);

    res.json({ mensagem: 'E-mail de recuperação enviado com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao iniciar recuperação de senha', detalhes: err.message });
  }
};

exports.redefinirSenha = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const usuario = await Usuario.findById(payload.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    usuario.senha = novaSenha;
    await usuario.save();
    res.json({ mensagem: 'Senha redefinida com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao redefinir senha', detalhes: err.message });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(200).json({ existe: true });
    } else {
      return res.status(404).json({ existe: false });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar e-mail', detalhes: err.message });
  }
};
