// Steam's public profile XML includes the avatar URL; no API key is needed.
const steamAvatarCache = new Map<string, string>()

export async function fetchSteamAvatar(steamId: string): Promise<string | null> {
    if (!steamId || !/^\d+$/.test(steamId)) {
        return null
    }
    if (steamAvatarCache.has(steamId)) {
        return steamAvatarCache.get(steamId) ?? null
    }
    try {
        const res = await fetch(`https://steamcommunity.com/profiles/${steamId}?xml=1`)
        if (!res.ok) {
            return null
        }
        const xml = await res.text()
        const match = xml.match(/<avatarMedium><!\[CDATA\[([^\]]+)\]\]><\/avatarMedium>/)
        const url = match ? match[1] : null
        // Leave failed lookups uncached so reopening the card can try again.
        if (url) {
            steamAvatarCache.set(steamId, url)
        }
        return url
    } catch (err) {
        console.log('steam avatar fetch error:', err)
        return null
    }
}
