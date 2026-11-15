import { useEffect } from 'react'

import { Game } from '../constants/games'
import { rankingsOptions } from '../functions/rankings/rankingsOptions'
import { writeRankings } from '../functions/rankings/writeRankings'
import { useDisplayOptionsStore } from '../stores/displayOptionsStore'
import { useGameStore } from '../stores/gameStore'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsStore } from '../stores/settingsStore'
import { Player, SettingsType } from '../types'
import useOverlayAvatars from './useOverlayAvatars'

export function writeRankingsFile(
    game: Game,
    players: Player[] | null,
    settings: SettingsType | null,
    elo: boolean,
    avatars: Record<number, string> = {}
) {
    // An empty list is written too, so the overlay is cleared when the game ends.
    if (settings && players) {
        writeRankings(game, players, { ...rankingsOptions(game, settings, elo), avatars })
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
    const avatars = useOverlayAvatars(
        settings !== null && rankingsOptions(game, settings, elo).showAvatar
    )

    useEffect(() => {
        writeRankingsFile(game, players, settings, elo, avatars)
    }, [settings, elo, game, players, avatars])
}
