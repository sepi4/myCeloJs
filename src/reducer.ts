import { AnyAction } from '@reduxjs/toolkit'
import initialStore from './initialStore'
import { Store } from './types'

function reducer(state: Store = initialStore, action: AnyAction) {
    switch (action.type) {
        default:
            return state
    }
}

export default reducer
