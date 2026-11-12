import { create } from 'zustand'

import { FoundMember } from '../types'

interface FoundPlayersStore {
    foundPlayers: FoundMember[]
    setFoundPlayers: (foundPlayers: FoundMember[]) => void
}

export const useFoundPlayersStore = create<FoundPlayersStore>((set) => ({
    foundPlayers: [],
    setFoundPlayers: (foundPlayers) => set({ foundPlayers }),
}))
