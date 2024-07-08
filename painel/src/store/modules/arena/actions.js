import types from './types';

export function allClientes() {
    return {type: types.ALL_ARENA}
}

export function filterArena(arena) {
    return {
        type: types.FILTER_ARENA,
        arena,
    };
}

export function updateArena(arena) {
    return {
        type: types.UPDATE_ARENA,
        arena,
    };
}
