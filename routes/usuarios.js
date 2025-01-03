const express = require('express');
const { cadastrarUsuario, trocarSenha } = require('../controllers/usuarioController');
const { recuperarSenha, redefinirSenha } = require('../controllers/usuarioController');
const autenticar_jwt = require('../middlewares/autenticar');

const router = express.Router();

router.post('/', cadastrarUsuario); //Criar um novo usuário
router.put('/:id/senha', trocarSenha); //Trocar a senha de um usuário

// Rota para recuperação de senha
router.post('/recuperar-senha', recuperarSenha);
router.post('/redefinir-senha', autenticar_jwt, redefinirSenha);

module.exports = router;
