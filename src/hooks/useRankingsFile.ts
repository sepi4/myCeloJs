import { useEffect } from 'react'

import { GAME_CONFIG } from '../constants/games'
import { writeRankings } from '../functions/rankings/writeRankings'
import { useGameStore } from '../stores/gameStore'
import { useNavButtonsStore } from '../stores/navButtonsStore'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsStore } from '../stores/settingsStore'

/** Re-writes the rankings overlay when orientation, ELO toggle, game or players change. */
export default function useRankingsFile() {
    const { game } = useGameStore()
    const {
        navButtons: { elo },
    } = useNavButtonsStore()
    const { players } = usePlayersStore()
    const { settings } = useSettingsStore()

    useEffect(() => {
        if (settings && players && players.length > 0) {
            writeRankings(
                game,
                players,
                settings.rankingsHorizontal,
                GAME_CONFIG[game].hasElo && elo
            )
        }
    }, [settings, elo, game, players])
}
