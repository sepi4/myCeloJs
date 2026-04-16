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
    noProfileGame: string | null
    setPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null) => void
    setNoProfile: (game: string) => void
    resetPlayerCard: () => void
}

export const usePlayerCardStore = create<PlayerCardStore>((set) => ({
    player: null,
    extraInfo: null,
    noProfileGame: null,
    setPlayerCard: (player, extraInfo) => set({ player, extraInfo, noProfileGame: null }),
    setNoProfile: (game) => set({ noProfileGame: game }),
    resetPlayerCard: () => set({ player: null, extraInfo: null, noProfileGame: null }),
}))
