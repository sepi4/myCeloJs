import { Game } from '../../constants/games'
import { AvailableLeaderboard, PlayerRanks, PlayerRanksById, PersonalStats } from '../../types'
import { normalizePersonalStats } from '../rankings/normalizePersonalStats'
import { personalStatByIdsUrl } from './apiUrls'
import { fetchAvailableLeaderboards } from './fetchAvailableLeaderboards'

export async function fetchPlayerRanksByIds(
    game: Game,
    ids: number[]
): Promise<{
    result: PlayerRanksById
    personalStats: PersonalStats
    cohTitles: AvailableLeaderboard
} | null> {
    try {
        const [personalStats, cohTitles] = await Promise.all([
            fetch(personalStatByIdsUrl(game, ids)).then((r) => {
                if (!r.ok) {
                    throw new Error(`${r.status}`)
                }
                return r.json() as Promise<PersonalStats>
            }),
            fetchAvailableLeaderboards(game),
        ])
        return {
            result: normalizePersonalStats(personalStats, cohTitles, ids),
            personalStats,
            cohTitles,
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function fetchPlayerRanks(
    game: Game,
    profileId: number
): Promise<PlayerRanks | undefined> {
    const fetched = await fetchPlayerRanksByIds(game, [profileId])
    return fetched?.result[profileId]
}
