import axios from 'axios'

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

export default mercadopago