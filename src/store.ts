import reducer from './reducer'
import initialStore from './initialStore'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer,
    devTools: true,
    preloadedState: initialStore,
})

export type RootState = ReturnType<typeof store.getState>
export default store
