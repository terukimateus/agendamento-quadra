const mongoose = require('mongoose')
const Schema = mongoose.Schema

const arena = new Schema ({
    nome: {
        type: String,
        required: [true, 'Nome e obrigatorio']
    },
    email: {
        type: String,
        required: [true, 'Email e obrigatorio']
    },
    senha: {
        type: String,
        required: [true, 'Senha e obrigatorio']
    },
    telefone: {
        type: String,
        required: true
    },
    quadras: {
        type: [Number],
        required: true
    },
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
        rua: String
    },
    geo: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
          },
        coordinates: [Number],
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
})

arena.index({ geo: '2dsphere' })

module.exports = mongoose.model('Arena', arena)