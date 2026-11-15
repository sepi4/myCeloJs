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
        let cancelled = false
        const pairs = key ? key.split(',').map((pair) => pair.split(':') as [string, string]) : []
        Promise.all(
            pairs.map(async ([profileId, steamId]) => ({
                profileId: Number(profileId),
                url: await window.electronAPI.steam.fetchAvatar(steamId),
            }))
        ).then((results) => {
            if (cancelled) {
                return
            }
            const next: Record<number, string> = {}
            for (const { profileId, url } of results) {
                if (url) {
                    next[profileId] = url
                }
            }
            setAvatars(next)
        })
        return () => {
            cancelled = true
        }
    }, [key])

    return avatars
}
