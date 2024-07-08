import { all, takeLatest, call, put } from 'redux-saga/effects'
import api from '../../../services/api'
import { updateAgendamento } from './actions'
import consts from '../../../const'
import types from './types'

export function* filterAgendamento({start, end, quadras}) {
    try {

        const query = {
            "arenaID": consts.arenaID,
            "range": {
                "start": start,
                "end": end
            },
        }
        if (quadras) {
            query.quadras ={ $in: quadras }
        }
        const {data: res} = yield call(api.post, '/agendamento/filter', query)

        if(res.error) {
            alert(res.message)
            return false
        }

        yield put(updateAgendamento(res.agendamentos))
    } catch (err) {
        alert(err.message)
    }
}

export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)])