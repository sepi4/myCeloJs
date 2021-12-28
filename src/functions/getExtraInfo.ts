import axios from 'axios'

import { refactorData } from './refactorData'
import { guessRankings } from './guessRankings'

import { RELIC_SERVER_BASE } from '../constants'
import {
    AvailableLeaderboard,
    NormalizedExtraInfo,
    PersonalStats,
} from '../types'

import { Player } from '../types'

export function getExtraInfo(
    players: Player[],
    callback: (a: NormalizedExtraInfo, b?: Player[][]) => void
) {
    // TODO - get rid of unnessary calls to server on app start

    const ids: number[] = []
    for (const p of players) {
        if (p.profileId) {
            ids.push(p.profileId)
        }
    }

    const strIds: string = ids.join(',')
    const url = `${RELIC_SERVER_BASE}/GetPersonalStat?title=coh2&profile_ids=[${strIds}]`
    const fetch1 = axios.get(url)

    const url2 = `${RELIC_SERVER_BASE}/GetAvailableLeaderboards?title=coh2`
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

                const teams = guessRankings(players, personalStats, cohTitles)
                callback(result, teams)
            }
        })
        .catch((error) => {
            console.log(error)
            // callback(result)
        })
}
