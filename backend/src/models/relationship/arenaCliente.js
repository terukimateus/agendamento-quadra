const mongoose = require('mongoose')
const Schema = mongoose.Schema

const arenacliente = new Schema ({
    arenaID: {
        type: mongoose.Types.ObjectId,
        ref: 'Arena',
        required: true,
      },
      clienteID: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente',
        required: true,
      },
      status: {
        type: String,
        enum: ['A', 'I'],
        required: true,
        default: 'A',
      },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Arena Cliente', arenacliente)