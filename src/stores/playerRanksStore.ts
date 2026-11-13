import { create } from 'zustand'

import { PlayerRanksById } from '../types'

interface PlayerRanksStore {
    playerRanks: PlayerRanksById | null
    setPlayerRanks: (playerRanks: PlayerRanksById) => void
    clearPlayerRanks: () => void
}

export const usePlayerRanksStore = create<PlayerRanksStore>((set) => ({
    playerRanks: null,
    setPlayerRanks: (playerRanks) => set({ playerRanks }),
    clearPlayerRanks: () => set({ playerRanks: null }),
}))
