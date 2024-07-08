const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const agendamento = new Schema ({
    clienteID: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    arenaID: {
        type: mongoose.Types.ObjectId,
        ref: 'Arena',
        required: true
    },
    quadras: {
        type: Number,
    },
    servicoID: {
        type: mongoose.Types.ObjectId,
        ref: 'Servico',
        required: true,
    },
    data: {
        type: Date,
        required: true
    }, 
    status: {
        type: String,
        enum: ['A', 'I'],
        required: true,
        default: 'I',
    },
    valor: {
        type: Number,
        required: true,
    },
    transactionID: {
        type: String,
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Agendamento', agendamento)