import { create } from 'zustand'

import { toggleKey, toggleKeys } from '../functions/utils/openKeys'

interface OpenInfosStore {
    /** profile ids of the players whose extra info is open */
    openInfos: number[]
    toggleOpenInfo: (profileId: number) => void
    /** Closes the given players when any of them is open, otherwise opens them all. */
    toggleOpenInfos: (profileIds: number[]) => void
    resetOpenInfos: () => void
}

export const useOpenInfosStore = create<OpenInfosStore>((set) => ({
    openInfos: [],
    toggleOpenInfo: (profileId) =>
        set((state) => ({ openInfos: toggleKey(state.openInfos, profileId) })),
    toggleOpenInfos: (profileIds) =>
        set((state) => ({ openInfos: toggleKeys(state.openInfos, profileIds) })),
    resetOpenInfos: () => set({ openInfos: [] }),
}))
