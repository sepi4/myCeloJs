import axios from 'axios'

import {  RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3  } from '../constants'
import { Member, SearchResult, StatGroup } from '../types'

export default function searchPlayers(
    coh3: boolean,
    searchValue: string,
    callback: (res: Member[]) => void
) {
    const url = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetPersonalStat?title=coh2&search=${searchValue}`

    axios
        .get(url)
        .then((result: SearchResult) => {
            if (
                result.status === 200 &&
                result.data.result.message === 'SUCCESS'
            ) {
                const playerArr: StatGroup[] = result.data.statGroups.filter(
                    (p: StatGroup) => p.type === 1
                )

                const mm: Member[] = playerArr.map(
                    (p: StatGroup) => p.members[0]
                )
                callback(mm)
            } else {
                console.log('searchPlayers else:', result)
                callback([])
            }
        })
        .catch((error) => {
            console.error(error)
            callback([])
        })
}
