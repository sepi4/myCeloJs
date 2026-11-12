import { Game, GAME_CONFIG } from '../../constants/games'
import { Member, StatGroup } from '../../types'

export default async function searchPlayers(game: Game, searchValue: string): Promise<Member[]> {
    const { apiBase, apiTitle } = GAME_CONFIG[game]
    const url = `${apiBase}/GetPersonalStat?title=${apiTitle}&search=${searchValue}`

    try {
        const res = await fetch(url)
        const data = await res.json()
        if (data.result.message === 'SUCCESS') {
            return data.statGroups
                .filter((p: StatGroup) => p.type === 1)
                .map((p: StatGroup) => p.members[0])
        }
        console.log('searchPlayers else:', data)
        return []
    } catch (error) {
        console.error(error)
        return []
    }
}
