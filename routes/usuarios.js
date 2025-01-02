const express = require('express');
const { cadastrarUsuario, trocarSenha } = require('../controllers/usuarioController');

const router = express.Router();

router.post('/', cadastrarUsuario);
router.put('/:id/senha', trocarSenha);

module.exports = router;
