const express = require('express')
const router = express.Router()

const Busboy = require('busboy');
const aws = require('../services/aws')

const Arena = require('../models/arena')
const Servico = require('../models/servico')
const Arquivo = require('../models/arquivo')

// FORMDATA

router.post('/', async (req, res) => {
    const busboy = new Busboy({ headers: req.headers })
    busboy.on('finish', async () => {
        try {
            const { arenaID, servico } = req.body
            let errors = []
            let arquivos = []

            /* 
                    {
                        "123213123": {...}
                        "123213123": {...}
                        "123213123": {...}
                    },
            */
            
           if(req.files && Object.keys(req.files).length > 0) {
                for(let key of Object.keys(req.files)) {
                    const file = req.files[key]

                    // 123123.jpg
                    const nameParts = file.name.split('.') // [123123, jpg]
                    const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`
                    
                    const path = `/servicos/${arenaID}/${fileName}`
                    
                    const response = await aws.uploadToS3(file, path)
                    
                    
                    if (response.error) {
                        errors.push({ error: true, message: response.message})
                    } else {
                        arquivos.push(path)
                    }
                }
            }

            if (errors.lenght > 0) {
                res.json(errors[0])
                return false
            }

            
            // CRIAR SERVICO
            let jsonServico = JSON.parse(servico)
            const servicoCadastrado = await Servico(jsonServico).save()
            // CRIAR ARQUIVO
            arquivos = arquivos.map((arquivo) => ({
                referenciaID: servicoCadastrado._id,
                model: 'Servico',
                caminho: arquivo,
            }))
            
            await Arquivo.insertMany(arquivos)
            
            res.json({ servicos: servicoCadastrado, arquivos })
            
        } catch (err) {
            res.json({ erro: true, message: err.message })
        }
    })
    req.pipe(busboy)
})


router.put('/:id', async (req, res) => {
    const busboy = new Busboy({ headers: req.headers })
    busboy.on('finish', async () => {
        try {
            const { arenaID, servico } = req.body
            let errors = []
            let arquivos = []

            /* 
                    {
                        "123213123": {...}
                        "123213123": {...}
                        "123213123": {...}
                    },
            */
            
            if(req.files && Object.keys(req.files).length > 0) {
                for(let key of Object.keys(req.files)) {
                    const file = req.files[key]

                    // 123123.jpg
                    const nameParts = file.name.split('.') // [123123, jpg]
                    const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`
                    
                    const path = `/servicos/${arenaID}/${fileName}`
                    const response = await aws.uploadToS3(file, path)
                

                    if (response.error) {
                        errors.push({ error: true, message: response.message})
                    } else {
                        arquivos.push(path)
                    }
                }
            }

            if (errors.lenght > 0) {
                res.json(errors[0])
                return false
            }


            const jsonServico = JSON.parse(servico)
            await Servico.findByIdAndUpdate(req.params.id, jsonServico)
            // CRIAR ARQUIVO
            arquivos = arquivos.map((arquivo) => ({
                referenciaID: req.params.id,
                model: 'Servico',
                caminho: arquivo,
            }))

            await Arquivo.insertMany(arquivos)

            res.json({ error: false })

        } catch (err) {
            res.json({ erro: true, message: err.message })
        }
    })
    req.pipe(busboy)
})

router.get('/arena/:arenaID', async (req, res) => {
    try {
        let servicosArena = []

        const servicos = await Servico.find({
            arenaID: req.params.arenaID,
            status: { $ne: 'E' }
        })

        for( let servico of servicos ) {
            const arquivos = await Arquivo.find({
                model: 'Servico',
                referenciaId: servico._id
            })
            servicosArena.push({ ...servico._doc, arquivos })
        }

        res.json({
            servicos: servicosArena,
        })
    } catch (err) {
        res.json({error: true, message: err.message})
    }
})

router.post('/delete-arquivo', async (req, res) => {
    try {
        const { id } = req.body

        //exclusao AWS
        await aws.deleteFileS3(id)

        await Arquivo.findOneAndDelete({
            caminho: id,
        })

        res.json ({ error: false })
    } catch {
        res.json({ erro: true, message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await Servico.findByIdAndUpdate(id, { status: 'E'})

        res.json ({ error: false })
    } catch {
        res.json({ erro: true, message: err.message })
    }
})



module.exports = router