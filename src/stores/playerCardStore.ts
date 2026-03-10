import { create } from 'zustand'

import { ExtraInfo } from '../types'

export interface PlayerCardData {
    name?: string
    country?: string
    profileId?: string | number
}

interface PlayerCardStore {
    player: PlayerCardData | null
    extraInfo: ExtraInfo | null
    setPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null) => void
    resetPlayerCard: () => void
}

export const usePlayerCardStore = create<PlayerCardStore>((set) => ({
    player: null,
    extraInfo: null,
    setPlayerCard: (player, extraInfo) => set({ player, extraInfo }),
    resetPlayerCard: () => set({ player: null, extraInfo: null }),
}))
