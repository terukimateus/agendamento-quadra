import axios from 'axios'

const api = axios.create({
    baseURL: 'https://agendamento-azure.vercel.app',
})

export default api