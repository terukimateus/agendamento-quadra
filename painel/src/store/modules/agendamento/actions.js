import types from './types'

export function filterAgendamento(start, end, quadras) {
    return {
        type: types.FILTER_AGENDAMENTOS,
        start, 
        end,
        ...(quadras && {quadras})
    }
}

export function updateAgendamento(agendamentos) {
    return {type: types.UPDATE_AGENDAMENTO, agendamentos}
}