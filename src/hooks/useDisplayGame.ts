import { createContext, useContext } from 'react'

import { Game } from '../constants/games'
import { useGameStore } from '../stores/gameStore'
import { usePlayerCardStore } from '../stores/playerCardStore'

/** True inside the player card, which can show the other game than the navbar. */
export const PlayerCardContext = createContext(false)

export function useDisplayGame(): Game {
    const inPlayerCard = useContext(PlayerCardContext)
    const selectedGame = usePlayerCardStore((s) => s.selectedGame)
    const navGame = useGameStore((s) => s.game)
    return inPlayerCard ? selectedGame : navGame
}
