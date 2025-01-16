const express = require('express');
const cors = require('cors');

const app = express();

// Importar rotas
const usuarioRoutes = require('../routes/usuarios');
const acessoRoutes = require('../routes/acessos');
const logger = require('../middlewares/logger'); // Importa o middleware

// Middlewares globais
app.use(express.json());
app.use(cors());
app.use(logger); // Usa o middleware de logger


app.use('/usuarios', usuarioRoutes);
app.use('/acessos', acessoRoutes);

module.exports = app;