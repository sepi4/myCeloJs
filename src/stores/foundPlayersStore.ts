import { create } from 'zustand'
import { Member } from '../types'

interface FoundPlayersStore {
    foundPlayers: Member[]
    setFoundPlayers: (foundPlayers: Member[]) => void
}

export const useFoundPlayersStore = create<FoundPlayersStore>((set) => ({
    foundPlayers: [],
    setFoundPlayers: (foundPlayers) => set({ foundPlayers }),
}))
