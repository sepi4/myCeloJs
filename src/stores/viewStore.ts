import { create } from 'zustand'

type View = 'main' | 'playerCard' | 'search'

interface ViewStore {
    view: View
    /** Where closing the player card returns to: the view it was opened from. */
    cardReturnView: 'main' | 'search'
    /** Page scroll position of each view, restored when the view is shown again. */
    scrollPositions: Record<View, number>
    setView: (view: View) => void
    /** Closes the current view: the player card goes back to where it was opened from. */
    closeView: () => void
}

function currentScrollY() {
    return typeof window === 'undefined' ? 0 : window.scrollY
}

export const useViewStore = create<ViewStore>((set, get) => ({
    view: 'main',
    cardReturnView: 'main',
    scrollPositions: { main: 0, playerCard: 0, search: 0 },
    setView: (view) =>
        set((state) => {
            if (view === state.view) {
                return state
            }
            const opensCard = view === 'playerCard'
            return {
                view,
                scrollPositions: { ...state.scrollPositions, [state.view]: currentScrollY() },
                cardReturnView: opensCard
                    ? state.view === 'search'
                        ? 'search'
                        : 'main'
                    : state.cardReturnView,
            }
        }),
    closeView: () => {
        const { view, cardReturnView, setView } = get()
        setView(view === 'playerCard' ? cardReturnView : 'main')
    },
}))
