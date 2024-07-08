import types from "./types"
import {produce} from 'immer'


const INITIAL_STATE = {
    arena: [],
}

function arena(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_ARENA: {
            return produce(state, (draft) => {
                draft.arena = action.arena
            })
        }
        default:
            return state
    }
}

export default arena