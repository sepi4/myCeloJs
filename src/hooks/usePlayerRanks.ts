import { useEffect } from 'react'

import { fetchPlayerRanksByIds } from '../functions/api/fetchPlayerRanks'
import { resolveRankings } from '../functions/rankings/resolveRankings'
import { useGameStore } from '../stores/gameStore'
import { usePlayerRanksStore } from '../stores/playerRanksStore'
import { usePlayersStore } from '../stores/playersStore'
import { Player } from '../types'

/** Fetches ranks and countries for the players read from the log. */
export default function usePlayerRanks() {
    const { playerRanks, setPlayerRanks } = usePlayerRanksStore()
    const { game } = useGameStore()
    const { players, setPlayers } = usePlayersStore()

    useEffect(() => {
        if (!players || players.length === 0 || playerRanks !== null) {
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
        async function load(currentPlayers: Player[]) {
            const fetched = await fetchPlayerRanksByIds(game, ids)
            if (!fetched || cancelled) {
                return
            }
            const teams = resolveRankings(
                currentPlayers,
                fetched.personalStats,
                fetched.availableLeaderboards
            )
            setPlayerRanks(fetched.result)
            setPlayers(teams.flat())
        }
        load(players)

        return () => {
            cancelled = true
        }
    }, [game, players, playerRanks, setPlayerRanks, setPlayers])
}
