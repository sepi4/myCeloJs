import { AnyAction } from '@reduxjs/toolkit'
import initialStore from './initialStore'
import { Store } from './types'

export function settingsView(
    state = initialStore.settingsView,
    action: AnyAction
) {
    switch (action.type) {
        case 'TOGGLE_SETTINGS_VIEW':
            return !state
        default:
            return state
    }
}

export function settings(state = initialStore.settings, action: AnyAction) {
    switch (action.type) {
        case 'SET_SETTINGS':
            return action.data
        default:
            return state
    }
}

export function updateCheckDone(
    state = initialStore.updateCheckDone,
    action: AnyAction
) {
    switch (action.type) {
        case 'UPDATE_CHECK_DONE':
            return true
        default:
            return state
    }
}

export function view(state = initialStore.view, action: AnyAction) {
    switch (action.type) {
        case 'SEARCH_VIEW_ON':
            return 'search'
        case 'PLAYER_CARD_ON':
            return 'playerCard'
        case 'TO_MAIN_VIEW':
            return 'main'
        case 'SET_NEW_PLAYERS':
            return 'main'
        default:
            return state
    }
}

export function sorter(state = initialStore.sorter, action: AnyAction) {
    switch (action.type) {
        case 'SET_SORTER':
            return state.name === action.data.name
                ? { name: action.data.name, reversed: !state.reversed }
                : { name: action.data.name, reversed: false }
        default:
            return state
    }
}

export function players(state = initialStore.players, action: AnyAction) {
    switch (action.type) {
        case 'SET_NEW_PLAYERS':
            return action.data
        case 'SET_EXTRA_INFO':
            return action.data.newPlayers
        default:
            return state
    }
}

function reducer(state: Store = initialStore, action: AnyAction) {
    switch (action.type) {
        default:
            return state
    }
}

export default reducer
