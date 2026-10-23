import { create } from 'zustand'

import { ExtraInfo, GameHistoryState } from '../types'
import { useViewStore } from './viewStore'

/** How many earlier player cards the back button can return to. */
const MAX_HISTORY = 20

export const EMPTY_GAME_HISTORY: GameHistoryState = { data: null, open: false, openGame: null }

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
    gameHistory: GameHistoryState
    /** Page scroll position to restore when the card is shown again. */
    scrollY: number
}

interface PlayerCardStore extends PlayerCardState {
    /** Earlier cards, oldest first. Filled when a card is opened from inside another card. */
    history: PlayerCardState[]
    /** Cards left with the back button, nearest last. Opening a new card clears them. */
    future: PlayerCardState[]
    /** Grows each time another card is shown, so the page knows when to restore `scrollY`. */
    navigation: number
    setPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null, coh3: boolean) => void
    setOtherGameData: (player: PlayerCardData | null, extraInfo: ExtraInfo | null) => void
    setOtherGameLoading: (loading: boolean) => void
    setSelectedCoh3: (coh3: boolean) => void
    updateGameHistory: (patch: Partial<GameHistoryState>) => void
    goBack: () => void
    goForward: () => void
    resetPlayerCard: () => void
}

const initialState = {
    history: [] as PlayerCardState[],
    future: [] as PlayerCardState[],
    navigation: 0,
    player: null,
    extraInfo: null,
    initialCoh3: false,
    selectedCoh3: false,
    otherPlayer: null,
    otherExtraInfo: null,
    otherGameLoading: false,
    otherGameChecked: false,
    gameHistory: EMPTY_GAME_HISTORY,
    scrollY: 0,
}

function currentScrollY() {
    return typeof window === 'undefined' ? 0 : window.scrollY
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
        gameHistory: state.gameHistory,
        scrollY: currentScrollY(),
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
                navigation: state.navigation + 1,
                player,
                extraInfo,
                initialCoh3: coh3,
                selectedCoh3: coh3,
                otherPlayer: null,
                otherExtraInfo: null,
                otherGameLoading: false,
                otherGameChecked: false,
                gameHistory: EMPTY_GAME_HISTORY,
                scrollY: 0,
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
                // The history belongs to the profile of one game, so start over.
                gameHistory: EMPTY_GAME_HISTORY,
            }
        }),
    updateGameHistory: (patch) =>
        set((state) => ({ gameHistory: { ...state.gameHistory, ...patch } })),
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
                navigation: state.navigation + 1,
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
                navigation: state.navigation + 1,
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
