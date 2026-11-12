import { create } from 'zustand'

import { SearchResult } from '../types'

interface FoundPlayersStore {
    foundPlayers: SearchResult[]
    setFoundPlayers: (foundPlayers: SearchResult[]) => void
}

export const useFoundPlayersStore = create<FoundPlayersStore>((set) => ({
    foundPlayers: [],
    setFoundPlayers: (foundPlayers) => set({ foundPlayers }),
}))
