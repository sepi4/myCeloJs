import { Game, GAME_CONFIG } from '../../constants/games'
import { AvailableLeaderboard, NormalizedExtraInfo, PersonalStats } from '../../types'
import { refactorData } from '../rankings/refactorData'

export async function getExtraInfo(
    game: Game,
    ids: number[]
): Promise<{
    result: NormalizedExtraInfo
    personalStats: PersonalStats
    cohTitles: AvailableLeaderboard
} | null> {
    // TODO - get rid of unnessary calls to server on app start

    const strIds: string = ids.join(',')
    const { apiBase, apiTitle } = GAME_CONFIG[game]
    const url = `${apiBase}/GetPersonalStat?title=${apiTitle}&profile_ids=[${strIds}]`
    const url2 = `${apiBase}/GetAvailableLeaderboards?title=${apiTitle}`

    try {
        const [personalStats, cohTitles] = await Promise.all([
            fetch(url).then((r) => {
                if (!r.ok) {
                    throw new Error(`${r.status}`)
                }
                return r.json() as Promise<PersonalStats>
            }),
            fetch(url2).then((r) => {
                if (!r.ok) {
                    throw new Error(`${r.status}`)
                }
                return r.json() as Promise<AvailableLeaderboard>
            }),
        ])
        return { result: refactorData(personalStats, cohTitles, ids), personalStats, cohTitles }
    } catch (error) {
        console.log(error)
        return null
    }
}
