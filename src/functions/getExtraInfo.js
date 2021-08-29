import axios from 'axios'

import { refactorData } from './refactorData'
import { guessRankings } from './guessRankings'

export function getExtraInfo(players, callback, forPlayerCard) {
    let ids = players.filter(p => p.profileId != undefined)
        .map(p => p.profileId)

    const url = 'https://coh2-api.reliclink.com/community/'
        + 'leaderboard/GetPersonalStat?title=coh2&profile_ids=['
        + ids.join(',') + ']'

    let leaderboard = undefined
    let cohTitles = undefined

    const fetch1 = axios.get(url)

    const url2 =
        'https://coh2-api.reliclink.com/' +
        'community/leaderboard/GetAvailableLeaderboards?title=coh2'

    const fetch2 = axios.get(url2)

    Promise.all([fetch1, fetch2])
        .then(values => {
            // debugger
            if (values[0].status === 200 && values[1].status === 200) {
                leaderboard = values[0].data
                cohTitles = values[1].data
                let result = refactorData(leaderboard, cohTitles, ids)
                if (forPlayerCard) {
                    callback(result)
                    return
                }

                const teams = guessRankings(players, leaderboard, cohTitles)
                callback(result, teams)
            }
        })
        .catch(error => {
            console.log(error)
            // callback(result)
        })
}