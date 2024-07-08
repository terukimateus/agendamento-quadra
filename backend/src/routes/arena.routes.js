const express = require('express')
const router = express.Router()
const Arena = require('../models/arena')
const Servico = require('../models/servico')
const turf = require('@turf/turf')


router.post('/', async (req, res) => {
    try {
        const arena = await new Arena(req.body).save()
        res.json({ arena })
    } catch (err) {
        res.json({ erro: true, message: err.message })
    }
})

router.put('/:id', async (req, res) => {
    const arenaID = req.params.id;

    // Extraia os campos necessários do corpo da requisição
    const { endereco, geo, nome, telefone, quadras } = req.body.arena;

    const updateData = {
        endereco,
        geo: {
            type: 'Point', // Defina o tipo de geometria, como 'Point' se for o caso
            coordinates: geo.coordinates
        },
        nome,
        telefone,
        quadras
    };
    try {
        // Tente atualizar a arena
        const updatedArena = await Arena.findByIdAndUpdate(
            arenaID,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedArena) {
            return res.status(404).json({ message: 'Arena não encontrada' });
        }

        return res.status(200).json({ message: 'Arena atualizada com sucesso', arena: updatedArena });
    } catch (error) {
        // Se houver erros de validação do Mongoose, trate-os aqui
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: 'Erro de validação', errors });
        }

        // Se ocorrer outro tipo de erro, retorne um erro 500
        console.error('Erro ao atualizar arena:', error);
        return res.status(500).json({ message: 'Erro ao atualizar arena', error });
    }
});

router.get('/servicos/:arenaID', async (req, res) => {
    try {
        const { arenaID } = req.params
        const servicos = await Servico.find({
            arenaID,
            status: 'A'
        }).select('_id titulo')

        res.json({
            servicos: servicos.map(s => ({label: s.titulo, value: s._id}))
            
        })
    } catch (err) {
        res.json({ erro: true, message: err.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const arena = await Arena.findById(req.params.id)
        // DISTANCIA

        const distance = turf.distance(
            turf.point(arena.geo.coordinates),
            turf.point([-23.4273279,-51.9481889])
        )
        const response = {
            error: false,
            _id: arena._id,
            endereco: arena.endereco,
            nome: arena.nome,
            telefone: arena.telefone,
            coordenadas: arena.geo.coordinates,
            quadras: arena.quadras,
            distance: distance
        };

        res.json( response )
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

module.exports = router