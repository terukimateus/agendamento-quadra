const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const horario = new Schema ({
    arenaID: {
        type: mongoose.Types.ObjectId,
        ref: 'Arena',
        required: true
    },
    dias: {
        type: [Number],
        required: true
    },
    inicio: {
        type: Date,
        required: true
    },
    fim: {
        type: Date,
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Horario', horario)