import types from './types'
import { all, takeLatest, call, put } from 'redux-saga/effects'
import api from '../../../services/api'
import { updateArena as updateArenaActions} from './actions'
import { act } from 'react'

export function* filterArena({arena}) {

    try {
        const {data: res} = yield call(api.get, `/arena/${arena}`)

        if(res.error) {
            alert(res.message)
            return false
        }

        yield put(updateArenaActions(res.arena))
    } catch (err) {
        alert(err.message)
    }
}

export function* updateArena(action) {
    
    const {data: res} = yield call(api.put, `/arena/${action.arena._id}`, {
        ...action
    })

    if(res.error) {
        alert(res.message)
        return false
    }
}

export default all([
    takeLatest(types.FILTER_ARENA, filterArena),
    takeLatest(types.UPDATE_ARENA, updateArena)
])