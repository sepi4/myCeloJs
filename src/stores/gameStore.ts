import { create } from 'zustand'

import { Game } from '../constants/games'

interface GameStore {
    game: Game
    setGame: (game: Game) => void
}

function loadGame(): Game {
    const stored = localStorage.getItem('game')
    if (stored === 'coh2' || stored === 'coh3') {
        return stored
    }
    // Versions up to 2.11 saved the game as the navButtons.coh3 flag.
    const oldNavButtons = localStorage.getItem('navButtons')
    return oldNavButtons && JSON.parse(oldNavButtons).coh3 ? 'coh3' : 'coh2'
}

export const useGameStore = create<GameStore>((set) => ({
    game: loadGame(),
    setGame: (game) => {
        localStorage.setItem('game', game)
        set({ game })
    },
}))
