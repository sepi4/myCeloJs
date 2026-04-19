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
    initialCoh3: boolean
    selectedCoh3: boolean
    otherPlayer: PlayerCardData | null
    otherExtraInfo: ExtraInfo | null
    otherGameLoading: boolean
    otherGameChecked: boolean
    setPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null, coh3: boolean) => void
    setOtherGameData: (player: PlayerCardData | null, extraInfo: ExtraInfo | null) => void
    setOtherGameLoading: (loading: boolean) => void
    setSelectedCoh3: (coh3: boolean) => void
    resetPlayerCard: () => void
}

const initialState = {
    player: null,
    extraInfo: null,
    initialCoh3: false,
    selectedCoh3: false,
    otherPlayer: null,
    otherExtraInfo: null,
    otherGameLoading: false,
    otherGameChecked: false,
}

export const usePlayerCardStore = create<PlayerCardStore>((set) => ({
    ...initialState,
    setPlayerCard: (player, extraInfo, coh3) =>
        set({
            player,
            extraInfo,
            initialCoh3: coh3,
            selectedCoh3: coh3,
            otherPlayer: null,
            otherExtraInfo: null,
            otherGameLoading: false,
            otherGameChecked: false,
        }),
    setOtherGameData: (otherPlayer, otherExtraInfo) =>
        set({
            otherPlayer,
            otherExtraInfo,
            otherGameLoading: false,
            otherGameChecked: true,
        }),
    setOtherGameLoading: (otherGameLoading) => set({ otherGameLoading }),
    setSelectedCoh3: (coh3) =>
        set((state) => {
            if (coh3 === state.selectedCoh3) {
                return state
            }
            return {
                player: state.otherPlayer,
                extraInfo: state.otherExtraInfo,
                otherPlayer: state.player,
                otherExtraInfo: state.extraInfo,
                selectedCoh3: coh3,
            }
        }),
    resetPlayerCard: () => set(initialState),
}))
