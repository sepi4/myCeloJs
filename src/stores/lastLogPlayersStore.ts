import { create } from 'zustand'

import { Player } from '../types'

interface LastLogPlayersStore {
    lastLogPlayers: Player[] | null
    setLastLogPlayers: (lastLogPlayers: Player[]) => void
}

export const useLastLogPlayersStore = create<LastLogPlayersStore>((set) => ({
    lastLogPlayers: null,
    setLastLogPlayers: (lastLogPlayers) => set({ lastLogPlayers }),
}))
