export function getLocalUserInfoCoh3(
    lines: string[]
): { profileId: number; steamId: string } | null {
    let profileId: number | null = null
    let steamId: string | null = null

    for (const line of lines) {
        if (!profileId) {
            const m = line.match(/login event\. LocalProfileID: (\d+)/)
            if (m) profileId = Number(m[1])
        }
        if (!steamId) {
            const m = line.match(/Found \d+ profiles for account \/steam\/(\d+)/)
            if (m) steamId = m[1]
        }
        if (profileId && steamId) break
    }

    return profileId && steamId ? { profileId, steamId } : null
}
