import { create } from 'zustand'

import { SearchResult } from '../types'

interface FoundPlayersStore {
    /** null until the first search has finished */
    foundPlayers: SearchResult[] | null
    setFoundPlayers: (foundPlayers: SearchResult[]) => void
}

export const useFoundPlayersStore = create<FoundPlayersStore>((set) => ({
    foundPlayers: null,
    setFoundPlayers: (foundPlayers) => set({ foundPlayers }),
}))
