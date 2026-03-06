import reducer from './reducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer,

    // devTools: true,
    // preloadedState: initialStore,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
