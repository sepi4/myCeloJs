import {
    settings,
    settingsView,
    sorter,
    updateCheckDone,
} from './reducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        settings,
        settingsView,
        sorter,
        updateCheckDone,
    },

    // devTools: true,
    // preloadedState: initialStore,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
