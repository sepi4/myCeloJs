import { Game } from '../../constants/games'
import { AvailableLeaderboard, ExtraInfo, NormalizedExtraInfo, PersonalStats } from '../../types'
import { refactorData } from '../rankings/refactorData'
import { availableLeaderboardsUrl, personalStatByIdsUrl } from './apiUrls'

export async function getExtraInfo(
    game: Game,
    ids: number[]
): Promise<{
    result: NormalizedExtraInfo
    personalStats: PersonalStats
    cohTitles: AvailableLeaderboard
} | null> {
    // TODO - get rid of unnessary calls to server on app start

    try {
        const [personalStats, cohTitles] = await Promise.all([
            fetch(personalStatByIdsUrl(game, ids)).then((r) => {
                if (!r.ok) {
                    throw new Error(`${r.status}`)
                }
                return r.json() as Promise<PersonalStats>
            }),
            fetch(availableLeaderboardsUrl(game)).then((r) => {
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

export async function fetchPlayerExtraInfo(
    game: Game,
    profileId: number
): Promise<ExtraInfo | undefined> {
    const fetched = await getExtraInfo(game, [profileId])
    return fetched?.result[profileId]
}
