import axios from 'axios'

// UUID ALEATORIO PARA API MERCADO PAGO 
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();


const mercadopago = axios.create({
    baseURL: 'https://api.mercadopago.com/v1/',
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Bearer {token_ACESS_mercado}',
        'X-Idempotency-Key': `${uuid}`
    }
});

export default mercadopago