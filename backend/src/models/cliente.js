const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cliente = new Schema ({
    person: {
        nome: {
            first_name: String,
            second_name: String,
        },
        dataNascimento: {
            type: String,
            required: true,
        },
        documento: {
            type: Number,
            required: true
        },
        endereco: {
            cidade: String,
            estado: String,
            cep: String,
            logradouro: String,
            bairro: String,
            numero: String,
            pais: String,
        },
        telefone: {
            type: String, unique: true, required: true
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        default: null
    },
    foto: {
        type: String,
    },
    sexo: {
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Cliente', cliente)