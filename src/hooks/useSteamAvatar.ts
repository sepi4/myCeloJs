import { useEffect, useState } from 'react'

function useSteamAvatar(steamId: string | null | undefined): string | null {
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!steamId) {
            setUrl(null)
            return
        }
        let cancelled = false
        window.electronAPI.steam.fetchAvatar(steamId).then((result) => {
            if (!cancelled) {
                setUrl(result)
            }
        })
        return () => {
            cancelled = true
        }
    }, [steamId])

    return url
}

export default useSteamAvatar
