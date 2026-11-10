import { create } from 'zustand'

import { ExtraInfo } from '../types'
import {
    PlayerCardData,
    PlayerCardState,
    snapshotPlayerCard,
    usePlayerCardStore,
} from './playerCardStore'
import { CardReturnView, useViewStore, View } from './viewStore'

/** How many earlier places the back button can return to. */
const MAX_HISTORY = 50

export interface Location {
    view: View
    cardReturnView: CardReturnView
    /** The shown card, saved only when the place is a player card. */
    card: PlayerCardState | null
}

interface NavigationStore {
    /** Earlier places, nearest last. */
    back: Location[]
    /** Places left with the back button, nearest last. Going somewhere new clears them. */
    forward: Location[]
    openView: (view: 'main' | 'search') => void
    openPlayerCard: (player: PlayerCardData, extraInfo: ExtraInfo | null, coh3: boolean) => void
    /** Escape and X: the player card returns to where it was opened from, other views to main. */
    closeView: () => void
    goBack: () => void
    goForward: () => void
    /** Shows the main view and forgets the history, for example after a new game. */
    resetNavigation: () => void
}

function currentLocation(): Location {
    const { view, cardReturnView } = useViewStore.getState()
    return { view, cardReturnView, card: view === 'playerCard' ? snapshotPlayerCard() : null }
}

function show(location: Location) {
    if (location.card) {
        usePlayerCardStore.getState().restorePlayerCard(location.card)
    }
    useViewStore.getState().setView(location.view, location.cardReturnView)
}

export const useNavigationStore = create<NavigationStore>((set, get) => {
    const remember = () =>
        set((state) => ({
            back: [...state.back, currentLocation()].slice(-MAX_HISTORY),
            forward: [],
        }))

    return {
        back: [],
        forward: [],
        openView: (view) => {
            if (view === useViewStore.getState().view) {
                return
            }
            remember()
            useViewStore.getState().setView(view)
        },
        openPlayerCard: (player, extraInfo, coh3) => {
            const shown = usePlayerCardStore.getState().player
            if (
                useViewStore.getState().view === 'playerCard' &&
                player.profileId !== undefined &&
                player.profileId === shown?.profileId
            ) {
                return
            }
            remember()
            usePlayerCardStore.getState().setPlayerCard(player, extraInfo, coh3)
            useViewStore.getState().setView('playerCard')
        },
        closeView: () => {
            const { view, cardReturnView } = useViewStore.getState()
            get().openView(view === 'playerCard' ? cardReturnView : 'main')
        },
        goBack: () => {
            const { back, forward } = get()
            const previous = back[back.length - 1]
            if (!previous) {
                return
            }
            set({ back: back.slice(0, -1), forward: [...forward, currentLocation()] })
            show(previous)
        },
        goForward: () => {
            const { back, forward } = get()
            const next = forward[forward.length - 1]
            if (!next) {
                return
            }
            set({ back: [...back, currentLocation()], forward: forward.slice(0, -1) })
            show(next)
        },
        resetNavigation: () => {
            usePlayerCardStore.getState().resetPlayerCard()
            useViewStore.getState().setView('main')
            set({ back: [], forward: [] })
        },
    }
})
