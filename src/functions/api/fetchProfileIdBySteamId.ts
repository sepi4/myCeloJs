import { Game, GAME_CONFIG } from '../../constants/games'

export async function fetchProfileIdBySteamId(game: Game, steamId: string): Promise<number | null> {
    const { apiBase, apiTitle } = GAME_CONFIG[game]
    const url = `${apiBase}/GetPersonalStat?title=${apiTitle}&profile_names=[%22%2Fsteam%2F${steamId}%22]`
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
