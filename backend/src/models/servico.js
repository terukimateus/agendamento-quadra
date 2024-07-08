const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const servico = new Schema ({
    arenaID: {
        type: mongoose.Types.ObjectId,
        ref: 'Arena',
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    duracao: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I'],
        default: 'A'
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Servico', servico)