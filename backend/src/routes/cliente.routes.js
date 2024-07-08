const express = require('express');
const mongoose = require('mongoose');

const Cliente = require('../models/cliente');
const router = express.Router();
const moment = require('moment');
const util = require('../util')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const ArenaCliente = require('../models/relationship/arenaCliente');

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, arenaID } = req.body;
    let newCliente = null;

    // VERIFICA SE EXISTE O CLIENTE
    const existentCliente = await Cliente.findOne({
      $or: [
        { email: cliente.email },
        { telefone: cliente.person.telefone},
        ],
    });    
    
    // SE NAO EXISTIR CLIENTE
    if (!existentCliente) { 
      const _id = new mongoose.Types.ObjectId();
      const cliente = req.body.cliente;

      hashedSenha =  await bcrypt.hash(cliente.senha, 10)

      // CRIANDO CLIENTE NO MONGO
      newCliente = await new Cliente({
        _id,
        senha: hashedSenha,
        ...cliente,
      }).save({ session });
    }

    const clienteID = existentCliente ? existentCliente._id : newCliente._id;
    
    // RELAÇÃO COM A ARENA
    const existentRelationship = await ArenaCliente.findOne({
      arenaID,
      clienteID,
      status: 'A'
    });

    // SE NAO ESTA VINCULADO
    if (!existentRelationship) {

      // Cria um novo objeto ArenaCliente e salva
      await new ArenaCliente({
        arenaID,
        clienteID 
      }).save({ session });
    }

    // SE JA EXISTIR O VINCULO
    if (existentRelationship && existentRelationship.status === 'I') {
      await ArenaCliente.findOneAndUpdate(
        {
          arenaID,
          clienteID,
        },
        { status: 'A' },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    if (existentRelationship && existentCliente) {
      res.json({ error: true, message: 'Cliente já cadastrado!' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

router.get('/:email', async (req, res) => {
  try {

    const email = req.params.email
    const cliente = await Cliente.findOne({ "email": email })

      res.json({ error: false, cliente })
  } catch (err) {
      res.json({ error: true, message: err.message })
  }
})


router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await Cliente.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: 'Usuário não encontrado' });
    }
    
    if (user.senha !== senha) {
      return res.status(400).json({ error: true, message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user._id }, 'seuSegredoJWT', { expiresIn: '1h' });
    res.json({ error: false, token, user });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

router.post('/filter', async (req, res) => {
  try {
    const clientes = await Cliente.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get('/arena/:arenaID', async (req, res) => {
  try {
    const clientes = await ArenaCliente.find({
      arenaID: req.params.arenaID,
      status: 'A',
    })
      .populate('clienteID')
      .select('clienteID');


    res.json({
      error: false,
      clientes: clientes.map((c) => ({
        vinculoId: c._id,
        dataCadastro: moment(c.dataCadastro).format('DD/MM/YYYY'),
        ...c.clienteID._doc,

      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete('/vinculo/:id', async (req, res) => {
  try {
    await ArenaCliente.findByIdAndDelete(req.params.id);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
