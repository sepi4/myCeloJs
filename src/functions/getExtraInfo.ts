import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../constants'
import { AvailableLeaderboard, NormalizedExtraInfo, PersonalStats } from '../types'
import { refactorData } from './refactorData'

export async function getExtraInfo(
    coh3: boolean,
    ids: number[]
): Promise<{
    result: NormalizedExtraInfo
    personalStats: PersonalStats
    cohTitles: AvailableLeaderboard
} | null> {
    // TODO - get rid of unnessary calls to server on app start

    const strIds: string = ids.join(',')
    const url = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetPersonalStat?title=coh${coh3 ? 3 : 2}&profile_ids=[${strIds}]`
    const url2 = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetAvailableLeaderboards?title=coh${coh3 ? 3 : 2}`

    try {
        const [personalStats, cohTitles] = await Promise.all([
            fetch(url).then((r) => {
                if (!r.ok) throw new Error(`${r.status}`)
                return r.json() as Promise<PersonalStats>
            }),
            fetch(url2).then((r) => {
                if (!r.ok) throw new Error(`${r.status}`)
                return r.json() as Promise<AvailableLeaderboard>
            }),
        ])
        return { result: refactorData(personalStats, cohTitles, ids), personalStats, cohTitles }
    } catch (error) {
        console.log(error)
        return null
    }
}
