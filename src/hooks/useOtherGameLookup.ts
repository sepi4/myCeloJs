import { useEffect } from 'react'

import { otherGame } from '../constants/games'
import { fetchPlayerRanks } from '../functions/api/fetchPlayerRanks'
import { fetchProfileIdBySteamId } from '../functions/api/fetchProfileIdBySteamId'
import { usePlayerCardStore } from '../stores/playerCardStore'

/** Looks up the card player's profile in the other game and saves it to the player card store. */
export default function useOtherGameLookup() {
    const {
        player,
        playerRanks,
        initialGame,
        selectedGame,
        otherGameChecked,
        setOtherGameData,
        setOtherGameLoading,
    } = usePlayerCardStore()

    const steamIdForLookup = selectedGame === initialGame ? playerRanks?.steamId : null

    useEffect(() => {
        // A card restored from the navigation history already knows its other-game profile.
        if (!steamIdForLookup || otherGameChecked) {
            return
        }
        const lookupGame = otherGame(initialGame)

        let cancelled = false
        setOtherGameLoading(true)

        async function lookup() {
            const profileId = await fetchProfileIdBySteamId(lookupGame, steamIdForLookup as string)
            if (cancelled) {
                return
            }
            if (!profileId) {
                setOtherGameData(null, null)
                return
            }
            const otherPlayerRanks = await fetchPlayerRanks(lookupGame, profileId)
            if (cancelled) {
                return
            }
            if (!otherPlayerRanks || otherPlayerRanks.ranks.length === 0) {
                setOtherGameData(null, null)
                return
            }
            const otherAlias = otherPlayerRanks.ranks[0]?.members?.find(
                (m) => m.profile_id === profileId
            )?.alias
            setOtherGameData(
                {
                    country: player?.country,
                    name: otherAlias ?? player?.name,
                    profileId,
                },
                otherPlayerRanks
            )
        }
        lookup()

        return () => {
            cancelled = true
        }
    }, [
        steamIdForLookup,
        initialGame,
        player,
        otherGameChecked,
        setOtherGameData,
        setOtherGameLoading,
    ])
}
