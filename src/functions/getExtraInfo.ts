import { refactorData } from './refactorData'

import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../constants'
import {
    AvailableLeaderboard,
    NormalizedExtraInfo,
    PersonalStats,
} from '../types'

export function getExtraInfo(
    coh3: boolean,
    ids: number[],
    callback: (
        a: NormalizedExtraInfo,
        b?: {
            personalStats: PersonalStats
            cohTitles: AvailableLeaderboard
        }
    ) => void
) {
    // TODO - get rid of unnessary calls to server on app start

    const strIds: string = ids.join(',')
    const url = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetPersonalStat?title=coh${coh3 ? 3 : 2}&profile_ids=[${strIds}]`
    const url2 = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetAvailableLeaderboards?title=coh${coh3 ? 3 : 2}`

    const promise1 = fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json() as Promise<PersonalStats>
    })
    const promise2 = fetch(url2).then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json() as Promise<AvailableLeaderboard>
    })

    Promise.all([promise1, promise2])
        .then(([personalStats, cohTitles]) => {
            const result: NormalizedExtraInfo = refactorData(
                personalStats,
                cohTitles,
                ids
            )
            callback(result, { personalStats, cohTitles })
        })
        .catch((error) => {
            console.log(error)
        })
}
