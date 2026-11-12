import { Game } from '../../constants/games'
import { Member, StatGroup } from '../../types'
import { personalStatSearchUrl } from './apiUrls'

export default async function searchPlayers(game: Game, searchValue: string): Promise<Member[]> {
    try {
        const res = await fetch(personalStatSearchUrl(game, searchValue))
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
