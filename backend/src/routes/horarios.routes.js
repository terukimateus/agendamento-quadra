const express = require('express')
const router = express.Router()
const Horario = require('../models/horario')

router.post('/', async (req, res) => {
    try {
        const horario = await new Horario(req.body).save()

        res.json({ horario })
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

router.get('/arena/:arenaID', async (req, res) => {
    try {
        const { arenaID } = req.params
        const horarios = await Horario.find({
            arenaID,
        })

        res.json({horarios})
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

router.put('/:horarioID', async (req, res) => {
    try {
        const { horarioID } = req.params
        const horario = req.body

        await Horario.findByIdAndUpdate(horarioID, horario)

        res.json({ horario })
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})
router.delete('/:horarioID', async (req, res) => {
    try {
        const { horarioID } = req.params

        await Horario.findByIdAndDelete(horarioID)

        res.json({ error: false })
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

module.exports = router