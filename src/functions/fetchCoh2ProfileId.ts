export async function fetchCoh2ProfileId(steamId: string): Promise<number | null> {
    const url =
        'https://coh2-api.reliclink.com/community/' +
        'leaderboard/GetPersonalStat?title=coh2&profile_names=[' +
        '%22%2Fsteam%2F' +
        steamId +
        '%22]'
    try {
        const res = await fetch(url)
        const data = await res.json()
        if (data.result.message !== 'SUCCESS') return null
        const group = data.statGroups.find((g: { type: number }) => g.type === 1)
        return group ? (group.members[0].profile_id as number) : null
    } catch {
        return null
    }
}
