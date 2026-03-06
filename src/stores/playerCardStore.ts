import { create } from 'zustand'
import { NormalizedExtraInfo, Player } from '../types'

interface PlayerCardStore {
    player: Player | null
    extraInfo: NormalizedExtraInfo | null
    setPlayerCard: (player: Player, extraInfo: NormalizedExtraInfo) => void
    resetPlayerCard: () => void
}

export const usePlayerCardStore = create<PlayerCardStore>((set) => ({
    player: null,
    extraInfo: null,
    setPlayerCard: (player, extraInfo) => set({ player, extraInfo }),
    resetPlayerCard: () => set({ player: null, extraInfo: null }),
}))
