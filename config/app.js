const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('../middlewares/logger'); // Importa o middleware


// Middlewares globais
app.use(express.json());
app.use(logger); // Usa o middleware de logger
app.use(cors());
app.use(bodyParser.json());

// Importar rotas
//const backupRoutes = require('../routes/backup');
app.use('/backup', require('../routes/backup'));

const usuarioRoutes = require('../routes/usuarios');
app.use('/usuarios', usuarioRoutes);

const acessoRoutes = require('../routes/acessos');
app.use('/acessos', acessoRoutes);

const aberturaRoutes = require('../routes/abertura');
app.use('/', aberturaRoutes);

const patioRoutes = require('../routes/patio');
app.use('/patio', patioRoutes);


module.exports = app;