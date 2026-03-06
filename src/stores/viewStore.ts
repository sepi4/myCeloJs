import { create } from 'zustand'

type View = 'main' | 'playerCard' | 'search'

interface ViewStore {
    view: View
    setView: (view: View) => void
}

export const useViewStore = create<ViewStore>((set) => ({
    view: 'main',
    setView: (view) => set({ view }),
}))
