import { Game } from '../../constants/games'
import { personalStatBySteamIdUrl } from './apiUrls'

export async function fetchProfileIdBySteamId(game: Game, steamId: string): Promise<number | null> {
    try {
        const res = await fetch(personalStatBySteamIdUrl(game, steamId))
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
