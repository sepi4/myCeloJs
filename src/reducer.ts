import { AnyAction } from '@reduxjs/toolkit'
import initialStore from './initialStore'
import { Store } from './types'

export function settings(state = initialStore.settings, action: AnyAction) {
    switch (action.type) {
        case 'SET_SETTINGS':
            return action.data
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
