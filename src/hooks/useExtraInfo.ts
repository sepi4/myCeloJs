import { useEffect } from 'react'

import { getExtraInfo } from '../functions/api/getExtraInfo'
import { resolveRankings } from '../functions/rankings/resolveRankings'
import { useExtraInfoStore } from '../stores/extraInfoStore'
import { useGameStore } from '../stores/gameStore'
import { usePlayersStore } from '../stores/playersStore'
import { Player } from '../types'

/** Fetches ranks and countries for the players read from the log. */
export default function useExtraInfo() {
    const { extraInfo, setExtraInfo } = useExtraInfoStore()
    const { game } = useGameStore()
    const { players, setPlayers } = usePlayersStore()

    useEffect(() => {
        if (!players || players.length === 0 || extraInfo !== null) {
            return
        }
        const ids: number[] = []
        for (const p of players) {
            if (p.profileId) {
                ids.push(p.profileId)
            }
        }

        // The log may be re-read while the request is in flight
        let cancelled = false
        async function fetchExtraInfo(currentPlayers: Player[]) {
            const fetched = await getExtraInfo(game, ids)
            if (!fetched || cancelled) {
                return
            }
            const teams = resolveRankings(currentPlayers, fetched.personalStats, fetched.cohTitles)
            setExtraInfo(fetched.result)
            setPlayers(teams.flat())
        }
        fetchExtraInfo(players)

        return () => {
            cancelled = true
        }
    }, [game, players, extraInfo, setExtraInfo, setPlayers])
}
