const express = require('express');
const { cadastrarUsuario, trocarSenha } = require('../controllers/usuarioController');
const { recuperarSenha, redefinirSenha } = require('../controllers/usuarioController');

const router = express.Router();

router.post('/', cadastrarUsuario);
router.put('/:id/senha', trocarSenha);

// Rota para recuperação de senha
router.post('/recuperar-senha', recuperarSenha);
router.post('/redefinir-senha', redefinirSenha);

module.exports = router;
