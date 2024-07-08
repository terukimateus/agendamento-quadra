const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Cliente = require('../models/cliente')
const Arena = require('../models/arena')
const Servico = require('../models/servico')
const Agendamento = require('../models/agendamento')
const Horarios = require('../models/horario')
const util = require('../util')
const keys = require('../data/keys.json')
const axios = require('axios')
const _ = require('lodash');
const moment = require('moment-timezone'); // Usando moment-timezone
// UUID ALEATORIO PARA API MERCADO PAGO 
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const mercadopago = axios.create({
    baseURL: 'https://api.mercadopago.com/v1/',
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Bearer APP_USR-8088731663436559-070214-e9609b003c75ebc3040845ca702a6eaf-1884190882',
        'X-Idempotency-Key': `${uuid}`
    }
});

router.post('/filter', async (req, res) => {
    try {
      const { range, arenaID, quadras } = req.body;
  
    // Construir a base da query
    const query = {
        status: 'A',
        arenaID,
        data: {
          $gte: moment(range.start).startOf('day'),
          $lte: moment(range.end).endOf('day'),
        },
      };
  
      // Condicionalmente adicionar o filtro de quadras
      if (quadras) {
        query.quadras = quadras;
      }
  
      const agendamentos = await Agendamento.find(query).populate([
        { path: 'servicoID', select: 'titulo duracao' },
        { path: 'clienteID', select: 'person.nome' },
      ]);
  
      res.json({ error: false, agendamentos });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });

router.post('/', async (req, res) => {
    const db = mongoose.connection;
    const session = await db.startSession();
    session.startTransaction();

    try {
        const { clienteID, arenaID, servicoID } = req.body;
        let agendamento = req.body
        // RECUPERAR O CLIENTE
        const cliente = await Cliente.findById(clienteID).select('person.nome person.documento email person.endereco customerID');
        if (!cliente) throw new Error('Cliente não encontrado');

        // RECUPERAR A ARENA
        const arena = await Arena.findById(arenaID).select('recipientID');
        if (!arena) throw new Error('Arena não encontrada');

        // RECUPERAR O SERVICO 
        const servico = await Servico.findById(servicoID).select('preco titulo');
        if (!servico) throw new Error('Serviço não encontrado');
        const precoFinal = util.toCents(servico.preco);
        console.log(precoFinal)

        const paymentBody = {
            "additional_info": {
                "payer": {
                    "first_name": cliente.person.nome.first_name, 
                    "last_name": cliente.person.nome.second_name, 
                    "address": {
                        "zip_code": cliente.person.endereco.cep,
                        "street_name": cliente.person.endereco.logradouro,
                        "street_number": cliente.person.endereco.numero,
                    }
                }
            },
            "payer": {
                "entity_type": "individual",
                "type": "customer",
                "id": null,
                "email": cliente.email,
                "identification": {
                    "type": "CPF",
                    "number": cliente.person.documento
                 },
            },
            "transaction_amount": precoFinal,
            "description": servico.titulo,
            "payment_method_id": "pix",
        };

        const createPayment = await mercadopago.post('/payments', paymentBody);

        if (createPayment.error) {
            throw { message: createPayment.message };
          }
        
          
          const paymentData = {  
              transaction_amount: createPayment.data.transaction_amount,
              currency_id: createPayment.data.currency_id,
              status: createPayment.data.status,
              status_detail: createPayment.data.status_detail,
              date_created: createPayment.data.date_created,
              date_of_expiration: createPayment.data.date_of_expiration,
              description: createPayment.data.description,
              payer: {
                  first_name: createPayment.data.additional_info.payer.first_name,
                  last_name: createPayment.data.additional_info.payer.last_name,
                  address: {
                      street_name: createPayment.data.additional_info.payer.address.street_name,
                      street_number: createPayment.data.additional_info.payer.address.street_number,
                      zip_code: createPayment.data.additional_info.payer.address.zip_code
                    }
                },
                point_of_interaction: {
                    transaction_data: {
                        qr_code: createPayment.data.point_of_interaction.transaction_data.qr_code,
                        qr_code_base64: createPayment.data.point_of_interaction.transaction_data.qr_code_base64,
                        ticket_url: createPayment.data.point_of_interaction.transaction_data.ticket_url
                    }
                }
            };
        
        // CRIAR O AGENDAMENTOS E AS TRANSAÇÕES

        agendamento = {
          ...agendamento,
          transactionID: createPayment.data.id,
          valor: servico.preco,
        };

        const agendamentos = await new Agendamento(agendamento).save();
    
        await session.commitTransaction();
        session.endSession();
            
        res.json({ success: true, agendamentos ,payment: paymentData});

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Erro ao criar pagamento:', err); // Log de erro
        res.status(400).json({ error: true, message: `Erro ao criar pagamento: ${err.message}` });
    }
});

moment.tz.setDefault('America/Sao_Paulo');

router.post('/dias-disponiveis', async (req, res) => {
    try {
        const { data, arenaID, servicoID, quadras } = req.body;
        const horarios = await Horarios.find({ arenaID });
        const servico = await Servico.findById(servicoID).select('duracao');

        let agenda = [];
        let lastDay = moment(data).startOf('day'); // Ajuste para seu fuso horário

        const servicoMinutos = util.hourToMinutes(moment(servico.duracao, 'HH:mm').format('HH:mm'));

        const servicoSlots = util.sliceMinutes(
            servico.duracao,
            moment(servico.duracao, 'HH:mm').add(servicoMinutos, 'minutes'),
            util.SLOT_DURATION
        ).length;

        for (let i = 0; i == 0 && agenda.length <= 0; i++) {
            const espacosValidos = horarios.filter((h) => {
                const diaSemanaDisponivel = h.dias.includes(moment(lastDay).day());
                return diaSemanaDisponivel;
            });

            if (espacosValidos.length > 0) {
                let todosHorariosDia = [];
                for (let espaco of espacosValidos) {
                    todosHorariosDia = [
                        ...todosHorariosDia,
                        ...util.sliceMinutes(
                            util.mergeDateTime(lastDay, espaco.inicio),
                            util.mergeDateTime(lastDay, espaco.fim),
                            util.SLOT_DURATION
                        ),
                    ];
                }

                const agendamentos = await Agendamento.find({
                    quadras: quadras,
                    data: {
                        $gte: moment(lastDay).startOf('day'),
                        $lte: moment(lastDay).endOf('day'),
                    },
                    status: 'A'
                }).select('data -_id');

                let horariosOcupado = agendamentos.map((a) => ({
                    inicio: moment(a.data),
                    fim: moment(a.data).add(servicoMinutos, 'minutes'),
                }));
                horariosOcupado = horariosOcupado
                    .map((h) => util.sliceMinutes(h.inicio, h.fim, util.SLOT_DURATION, false))
                    .flat();


                let horariosLivres = util.splitByValue(
                    _.uniq(
                        todosHorariosDia.map((h) => {
                            return horariosOcupado.includes(h) ? '-' : h;
                        })
                    ),
                    '-'
                );

                horariosLivres = horariosLivres
                    .filter((h) => Array.isArray(h) && h.length >= servicoSlots)
                    .flat();

                horariosLivres = _.chunk(horariosLivres, 2);
                if (horariosLivres.length > 0) {
                    agenda.push({
                        dia: lastDay.format('YYYY-MM-DD'),
                        horarios: horariosLivres.flat(),
                    });
                }
            }

            lastDay = lastDay.add(1, 'day');
        }

        res.json({ error: false, agenda });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const agendamento = await Agendamento.findByIdAndUpdate(id, {
            "status": 'A'
        })
    
          res.json({ error: false, agendamento })
      } catch (err) {
          res.json({ error: true, message: err.message })
      }
})



module.exports = router;