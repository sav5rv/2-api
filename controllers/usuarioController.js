const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');
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
      service: 'hotmail', // Ou o serviço de e-mail que você está usando
      auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS, // Sua senha ou App Password
      },
    });

    // Criar o link de redefinição de senha
    const link = `http://localhost:3000/usuarios/redefinir-senha/${token}`;

    // Configurar o e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER, // Remetente
      to: email, // Destinatário
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
