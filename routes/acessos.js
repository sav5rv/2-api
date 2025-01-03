const express = require('express');
const { registrarAcesso, obterAcessos, listarTodosAcessos, listarAcessosUsuario } = require('../controllers/acessoController');

const router = express.Router();

// Rota para registrar acessos
router.post('/registrar', registrarAcesso);

// Rota para obter todos os acessos
router.get('/obter-acessos', obterAcessos);

router.get('/listar-todos-acessos', listarTodosAcessos); // Listar todos os acessos
router.get('/listar-acesso/:id', listarAcessosUsuario); // Listar acessos de um usuário específico

module.exports = router;