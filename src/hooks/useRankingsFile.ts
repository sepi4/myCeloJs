import { useEffect } from 'react'

import { Game, GAME_CONFIG } from '../constants/games'
import { writeRankings } from '../functions/rankings/writeRankings'
import { useDisplayOptionsStore } from '../stores/displayOptionsStore'
import { useGameStore } from '../stores/gameStore'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsStore } from '../stores/settingsStore'
import { Player, SettingsType } from '../types'

export function writeRankingsFile(
    game: Game,
    players: Player[] | null,
    settings: SettingsType | null,
    elo: boolean
) {
    // An empty list is written too, so the overlay is cleared when the game ends.
    if (settings && players) {
        writeRankings(game, players, settings.rankingsHorizontal, GAME_CONFIG[game].hasElo && elo)
    }
}

/** Writes the rankings overlay when orientation, ELO toggle, game or players change. */
export default function useRankingsFile() {
    const { game } = useGameStore()
    const {
        displayOptions: { showElo: elo },
    } = useDisplayOptionsStore()
    const { players } = usePlayersStore()
    const { settings } = useSettingsStore()

    useEffect(() => {
        writeRankingsFile(game, players, settings, elo)
    }, [settings, elo, game, players])
}
