import axios from 'axios'

import { RELIC_SERVER_BASE } from '../constants'
import { Member, PersonalStats, StatGroup } from '../types'

interface SearchResult {
    data: PersonalStats
    status: number
    statusText: string
    //...
}

export default function searchPlayers(
    searchValue: string,
    callback: (res: Member[]) => void
) {
    const url = `${RELIC_SERVER_BASE}/GetPersonalStat?title=coh2&search=${searchValue}`

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
