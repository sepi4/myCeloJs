import { create } from 'zustand'

import { ExtraInfo } from '../types'
import { useViewStore } from './viewStore'

/** How many earlier player cards the back button can return to. */
const MAX_HISTORY = 20

export interface PlayerCardData {
    name?: string
    country?: string
    profileId?: string | number
}

interface PlayerCardState {
    player: PlayerCardData | null
    extraInfo: ExtraInfo | null
    initialCoh3: boolean
    selectedCoh3: boolean
    otherPlayer: PlayerCardData | null
    otherExtraInfo: ExtraInfo | null
    otherGameLoading: boolean
    otherGameChecked: boolean
}

interface PlayerCardStore extends PlayerCardState {
    /** Earlier cards, oldest first. Filled when a card is opened from inside another card. */
    history: PlayerCardState[]
    /** Cards left with the back button, nearest last. Opening a new card clears them. */
    future: PlayerCardState[]
    setPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null, coh3: boolean) => void
    setOtherGameData: (player: PlayerCardData | null, extraInfo: ExtraInfo | null) => void
    setOtherGameLoading: (loading: boolean) => void
    setSelectedCoh3: (coh3: boolean) => void
    goBack: () => void
    goForward: () => void
    resetPlayerCard: () => void
}

const initialState = {
    history: [] as PlayerCardState[],
    future: [] as PlayerCardState[],
    player: null,
    extraInfo: null,
    initialCoh3: false,
    selectedCoh3: false,
    otherPlayer: null,
    otherExtraInfo: null,
    otherGameLoading: false,
    otherGameChecked: false,
}

function snapshot(state: PlayerCardStore): PlayerCardState {
    return {
        player: state.player,
        extraInfo: state.extraInfo,
        initialCoh3: state.initialCoh3,
        selectedCoh3: state.selectedCoh3,
        otherPlayer: state.otherPlayer,
        otherExtraInfo: state.otherExtraInfo,
        otherGameLoading: state.otherGameLoading,
        otherGameChecked: state.otherGameChecked,
    }
}

export const usePlayerCardStore = create<PlayerCardStore>((set) => ({
    ...initialState,
    setPlayerCard: (player, extraInfo, coh3) =>
        set((state) => {
            // Opening a card from inside another card remembers the current one,
            // opening it from anywhere else starts a new history.
            const fromCard = useViewStore.getState().view === 'playerCard' && state.player
            const history = fromCard ? [...state.history, snapshot(state)].slice(-MAX_HISTORY) : []
            return {
                history,
                future: [],
                player,
                extraInfo,
                initialCoh3: coh3,
                selectedCoh3: coh3,
                otherPlayer: null,
                otherExtraInfo: null,
                otherGameLoading: false,
                otherGameChecked: false,
            }
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
    goBack: () =>
        set((state) => {
            const previous = state.history[state.history.length - 1]
            if (!previous) {
                return state
            }
            return {
                ...previous,
                history: state.history.slice(0, -1),
                future: [...state.future, snapshot(state)],
            }
        }),
    goForward: () =>
        set((state) => {
            const next = state.future[state.future.length - 1]
            if (!next) {
                return state
            }
            return {
                ...next,
                history: [...state.history, snapshot(state)],
                future: state.future.slice(0, -1),
            }
        }),
    resetPlayerCard: () => set(initialState),
}))

// Closing the card (Escape, X or any other view) forgets its history.
useViewStore.subscribe(({ view }) => {
    const { history, future } = usePlayerCardStore.getState()
    if (view !== 'playerCard' && (history.length > 0 || future.length > 0)) {
        usePlayerCardStore.setState({ history: [], future: [] })
    }
})
