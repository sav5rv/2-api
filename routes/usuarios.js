const express = require('express');
const router = express.Router();
const autenticar_jwt = require('../middlewares/autenticar');

const usuContr = require('../controllers/usuarioController');

// Rota para logar usuario
router.post('/login', usuContr.login);

// Rota para recuperação de senha
router.put('/:id/senha', usuContr.trocarSenha); //Trocar a senha de um usuário
router.post('/recuperar-senha', usuContr.recuperarSenha);
router.post('/redefinir-senha', autenticar_jwt, usuContr.redefinirSenha);

// Endpoints para CRUD de usuários
router.post('/cadastrar', usuContr.cadastrarUsuario);
router.get('/listar', usuContr.listarUsuarios);
router.get('/:id', usuContr.obterUsuarioPorId);
router.put('/atualizar/:id', usuContr.atualizarUsuario);
router.delete('/:id', usuContr.removerUsuario);

module.exports = router;
