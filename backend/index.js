const express = require('express');
const app = express();
const morgan = require('morgan');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('./database');
// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(busboy());
app.use(busboyBodyParser());
// Variables
const port = process.env.PORT || 4000;
app.set('port', port);

// Routes
app.use('/arena', require('./src/routes/arena.routes'));
app.use('/servicos', require('./src/routes/servico.routes'));
app.use('/horarios', require('./src/routes/horarios.routes'));
app.use('/cliente', require('./src/routes/cliente.routes'));
app.use('/agendamento', require('./src/routes/agendamento.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
