import { create } from 'zustand'

import { Game, GAMES } from '../constants/games'
import getLocalStorage, { setLocalStorage } from '../functions/settings/getLocalStorage'

interface GameStore {
    game: Game
    setGame: (game: Game) => void
}

function loadGame(): Game {
    const stored = getLocalStorage<Game | null>('game', null)
    if (stored && GAMES.includes(stored)) {
        return stored
    }
    // Versions up to 2.11 saved the game as the navButtons.coh3 flag.
    return getLocalStorage<{ coh3?: boolean }>('navButtons', {}).coh3 ? 'coh3' : 'coh2'
}

export const useGameStore = create<GameStore>((set) => ({
    game: loadGame(),
    setGame: (game) => {
        setLocalStorage('game', game)
        set({ game })
    },
}))
