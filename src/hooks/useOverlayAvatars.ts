import { useEffect, useState } from 'react'

import { usePlayerRanksStore } from '../stores/playerRanksStore'
import { usePlayersStore } from '../stores/playersStore'

/** Steam avatar URLs by profile ID for the players in the game, fetched only when enabled. */
export default function useOverlayAvatars(enabled: boolean): Record<number, string> {
    const { players } = usePlayersStore()
    const { playerRanks } = usePlayerRanksStore()
    const [avatars, setAvatars] = useState<Record<number, string>>({})

    // A string key, so the effect runs only when the set of Steam IDs changes.
    const key = enabled
        ? (players ?? [])
              .flatMap((p) => {
                  const steamId = p.profileId ? playerRanks?.[p.profileId]?.steamId : undefined
                  return steamId ? [`${p.profileId}:${steamId}`] : []
              })
              .join(',')
        : ''

    useEffect(() => {
        if (!key) {
            return
        }
        let cancelled = false
        // Each avatar is added when it arrives, so one slow Steam profile does not hold back the
        // others. Avatars from earlier games are kept, as they are looked up by profile ID.
        for (const pair of key.split(',')) {
            const [profileId, steamId] = pair.split(':') as [string, string]
            const id = Number(profileId)
            window.electronAPI.steam.fetchAvatar(steamId).then((url) => {
                if (cancelled || !url) {
                    return
                }
                setAvatars((prev) => (prev[id] === url ? prev : { ...prev, [id]: url }))
            })
        }
        return () => {
            cancelled = true
        }
    }, [key])

    return avatars
}
