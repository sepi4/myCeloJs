import { useEffect } from 'react'

import { otherGame } from '../constants/games'
import { fetchProfileIdBySteamId } from '../functions/api/fetchProfileIdBySteamId'
import { fetchPlayerExtraInfo } from '../functions/api/getExtraInfo'
import { usePlayerCardStore } from '../stores/playerCardStore'

/** Looks up the card player's profile in the other game and saves it to the player card store. */
export default function useOtherGameLookup() {
    const {
        player,
        extraInfo,
        initialGame,
        selectedGame,
        otherGameChecked,
        setOtherGameData,
        setOtherGameLoading,
    } = usePlayerCardStore()

    const steamIdForLookup = selectedGame === initialGame ? extraInfo?.steamId : null

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
            const otherExtraInfo = await fetchPlayerExtraInfo(lookupGame, profileId)
            if (cancelled) {
                return
            }
            if (!otherExtraInfo || otherExtraInfo.ranks.length === 0) {
                setOtherGameData(null, null)
                return
            }
            const otherAlias = otherExtraInfo.ranks[0]?.members?.find(
                (m) => m.profile_id === profileId
            )?.alias
            setOtherGameData(
                {
                    country: player?.country,
                    name: otherAlias ?? player?.name,
                    profileId,
                },
                otherExtraInfo
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
