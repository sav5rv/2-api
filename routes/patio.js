const express = require('express');
const router = express.Router();

const patioContr = require('../controllers/patioController');

// Endpoints para CRUD de patio
router.post('/cadastrar', patioContr.cadastrarPatio);
router.get('/listar', patioContr.listarPatios);
router.get('/:id', patioContr.obterPatioPorId);
router.put('/atualizar/:id', patioContr.atualizarPatio);
router.delete('/:id', patioContr.removerPatio);

module.exports = router;
