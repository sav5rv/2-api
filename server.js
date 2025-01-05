//require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDatabase = require('./config/db');
const logger = require('./middlewares/logger'); // Importa o middleware

const app = express();

// Middlewares globais
app.use(express.json());
app.use(logger); // Usa o middleware de logger

//chama a função que está em /config/db para conectar ao Bc Dados
connectDatabase();

// Importar rotas
const usuarioRoutes = require('./routes/usuarios');
const acessoRoutes = require('./routes/acessos');

app.use('/usuarios', usuarioRoutes);
app.use('/acessos', acessoRoutes);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app; // Exporta o app para testes