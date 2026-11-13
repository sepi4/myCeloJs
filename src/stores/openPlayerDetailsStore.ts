import { create } from 'zustand'

import { toggleKey, toggleKeys } from '../functions/utils/openKeys'

interface OpenPlayerDetailsStore {
    /** profile ids of the players whose details are open */
    openPlayers: number[]
    toggleOpenPlayer: (profileId: number) => void
    /** Closes the given players when any of them is open, otherwise opens them all. */
    toggleOpenPlayers: (profileIds: number[]) => void
    resetOpenPlayers: () => void
}

export const useOpenPlayerDetailsStore = create<OpenPlayerDetailsStore>((set) => ({
    openPlayers: [],
    toggleOpenPlayer: (profileId) =>
        set((state) => ({ openPlayers: toggleKey(state.openPlayers, profileId) })),
    toggleOpenPlayers: (profileIds) =>
        set((state) => ({ openPlayers: toggleKeys(state.openPlayers, profileIds) })),
    resetOpenPlayers: () => set({ openPlayers: [] }),
}))
