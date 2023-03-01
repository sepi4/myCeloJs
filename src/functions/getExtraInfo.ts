import axios from 'axios'

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
    const fetch1 = axios.get(url)

    const url2 = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetAvailableLeaderboards?title=coh${coh3 ? 3 : 2}`
    const fetch2 = axios.get(url2)

    Promise.all([fetch1, fetch2])
        .then((values) => {
            let personalStats: PersonalStats
            let cohTitles: AvailableLeaderboard

            if (values[0].status === 200 && values[1].status === 200) {
                personalStats = values[0].data
                cohTitles = values[1].data
                const result: NormalizedExtraInfo = refactorData(
                    personalStats,
                    cohTitles,
                    ids
                )

                callback(result, {
                    personalStats,
                    cohTitles,
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
