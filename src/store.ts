import {
    alert,
    appLocation,
    autoLogChecking,
    countryFlags,
    extraInfo,
    foundPlayers,
    fromFile,
    logCheckInterval,
    navButtons,
    openInfos,
    playerCard,
    players,
    settings,
    settingsView,
    sorter,
    updateCheckDone,
    view,
} from './reducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        alert,
        appLocation,
        autoLogChecking,
        countryFlags,
        extraInfo,
        foundPlayers,
        fromFile,
        logCheckInterval,
        navButtons,
        openInfos,
        playerCard,
        players,
        settings,
        settingsView,
        sorter,
        updateCheckDone,
        view,
    },

    // devTools: true,
    // preloadedState: initialStore,
})

export type RootState = ReturnType<typeof store.getState>
export default store
