import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../../constants/urls'

export async function fetchProfileIdBySteamId(
    coh3: boolean,
    steamId: string
): Promise<number | null> {
    const base = coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2
    const title = coh3 ? 'coh3' : 'coh2'
    const url =
        `${base}/GetPersonalStat?title=${title}&profile_names=` + `[%22%2Fsteam%2F${steamId}%22]`
    try {
        const res = await fetch(url)
        const data = await res.json()
        if (data.result?.message !== 'SUCCESS') {
            return null
        }
        const group = data.statGroups?.find((g: { type: number }) => g.type === 1)
        return group ? (group.members[0].profile_id as number) : null
    } catch {
        return null
    }
}
