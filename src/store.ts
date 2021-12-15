import {
    logCheckInterval,
    autoLogChecking,
    settingsView,
    alert,
    settings,
    updateCheckDone,
    extraInfo,
    foundPlayers,
    playerCard,
    sorter,
    openInfos,
    players,
    navButtons,
    view,
    fromFile,
    countryFlags,
    appLocation,
} from './reducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        settingsView,
        autoLogChecking,
        logCheckInterval,
        alert,
        settings,
        updateCheckDone,
        extraInfo,
        foundPlayers,
        playerCard,
        sorter,
        openInfos,
        players,
        navButtons,
        view,
        fromFile,
        countryFlags,
        appLocation,
    },

    // devTools: true,
    // preloadedState: initialStore,
})

export type RootState = ReturnType<typeof store.getState>
export default store
