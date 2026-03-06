import { create } from 'zustand'
import { Player } from '../types'

interface PlayersStore {
    players: Player[] | null
    setPlayers: (players: Player[]) => void
    clearPlayers: () => void
}

export const usePlayersStore = create<PlayersStore>((set) => ({
    players: null,
    setPlayers: (players) => set({ players }),
    clearPlayers: () => set({ players: null }),
}))
