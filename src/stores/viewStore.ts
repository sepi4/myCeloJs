import { create } from 'zustand'

export type View = 'main' | 'playerCard' | 'search'
export type CardReturnView = 'main' | 'search'

interface ViewStore {
    view: View
    /** Where closing the player card returns to: the view it was opened from. */
    cardReturnView: CardReturnView
    /** Page scroll position of each view, restored when the view is shown again. */
    scrollPositions: Record<View, number>
    /** Pass `cardReturnView` when showing a place from the navigation history. */
    setView: (view: View, cardReturnView?: CardReturnView) => void
}

function currentScrollY() {
    return typeof window === 'undefined' ? 0 : window.scrollY
}

export const useViewStore = create<ViewStore>((set) => ({
    view: 'main',
    cardReturnView: 'main',
    scrollPositions: { main: 0, playerCard: 0, search: 0 },
    setView: (view, cardReturnView) =>
        set((state) => {
            if (
                view === state.view &&
                (cardReturnView === undefined || cardReturnView === state.cardReturnView)
            ) {
                return state
            }
            const opensCard = view === 'playerCard' && state.view !== 'playerCard'
            return {
                view,
                scrollPositions: { ...state.scrollPositions, [state.view]: currentScrollY() },
                cardReturnView:
                    cardReturnView ??
                    (opensCard
                        ? state.view === 'search'
                            ? 'search'
                            : 'main'
                        : state.cardReturnView),
            }
        }),
}))
