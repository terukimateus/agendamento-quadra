import {combineReducers} from 'redux'

import agendamento from './modules/agendamento/reducer'
import cliente from './modules/cliente/reducer'
import arena from './modules/arena/reducer'

export default combineReducers({
    agendamento,
    cliente,
    arena
})