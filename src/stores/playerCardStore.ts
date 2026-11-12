import { create } from 'zustand'

import { Game } from '../constants/games'
import { ExtraInfo, GameHistoryState } from '../types'

export const EMPTY_GAME_HISTORY: GameHistoryState = { data: null, open: false, openGame: null }

export interface PlayerCardData {
    name?: string
    country?: string
    profileId?: number
}

export interface PlayerCardState {
    player: PlayerCardData | null
    extraInfo: ExtraInfo | null
    initialGame: Game
    selectedGame: Game
    otherPlayer: PlayerCardData | null
    otherExtraInfo: ExtraInfo | null
    otherGameLoading: boolean
    otherGameChecked: boolean
    gameHistory: GameHistoryState
    /** Page scroll position to restore when the card is shown again. */
    scrollY: number
}

interface PlayerCardStore extends PlayerCardState {
    /** Grows each time another card is shown, so the page knows when to restore `scrollY`. */
    navigation: number
    setPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null, game: Game) => void
    setOtherGameData: (player: PlayerCardData | null, extraInfo: ExtraInfo | null) => void
    setOtherGameLoading: (loading: boolean) => void
    setSelectedGame: (game: Game) => void
    updateGameHistory: (patch: Partial<GameHistoryState>) => void
    /** Shows a card saved earlier with `snapshotPlayerCard`. */
    restorePlayerCard: (card: PlayerCardState) => void
    resetPlayerCard: () => void
}

const initialState: PlayerCardState & { navigation: number } = {
    navigation: 0,
    player: null,
    extraInfo: null,
    initialGame: 'coh2',
    selectedGame: 'coh2',
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

export function snapshotPlayerCard(): PlayerCardState {
    const state = usePlayerCardStore.getState()
    return {
        player: state.player,
        extraInfo: state.extraInfo,
        initialGame: state.initialGame,
        selectedGame: state.selectedGame,
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
    setPlayerCard: (player, extraInfo, game) =>
        set((state) => ({
            navigation: state.navigation + 1,
            player,
            extraInfo,
            initialGame: game,
            selectedGame: game,
            otherPlayer: null,
            otherExtraInfo: null,
            otherGameLoading: false,
            otherGameChecked: false,
            gameHistory: EMPTY_GAME_HISTORY,
            scrollY: 0,
        })),
    setOtherGameData: (otherPlayer, otherExtraInfo) =>
        set({
            otherPlayer,
            otherExtraInfo,
            otherGameLoading: false,
            otherGameChecked: true,
        }),
    setOtherGameLoading: (otherGameLoading) => set({ otherGameLoading }),
    setSelectedGame: (game) =>
        set((state) => {
            if (game === state.selectedGame) {
                return state
            }
            return {
                player: state.otherPlayer,
                extraInfo: state.otherExtraInfo,
                otherPlayer: state.player,
                otherExtraInfo: state.extraInfo,
                selectedGame: game,
                // The history belongs to the profile of one game, so start over.
                gameHistory: EMPTY_GAME_HISTORY,
            }
        }),
    updateGameHistory: (patch) =>
        set((state) => ({ gameHistory: { ...state.gameHistory, ...patch } })),
    restorePlayerCard: (card) => set((state) => ({ ...card, navigation: state.navigation + 1 })),
    resetPlayerCard: () => set(initialState),
}))
