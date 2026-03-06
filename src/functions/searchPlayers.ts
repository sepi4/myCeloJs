import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../constants'
import { Member, StatGroup } from '../types'

export default function searchPlayers(
    coh3: boolean,
    searchValue: string,
    callback: (res: Member[]) => void
) {
    const url = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetPersonalStat?title=coh2&search=${searchValue}`

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.result.message === 'SUCCESS') {
                const playerArr: StatGroup[] = data.statGroups.filter(
                    (p: StatGroup) => p.type === 1
                )

                const mm: Member[] = playerArr.map(
                    (p: StatGroup) => p.members[0]
                )
                callback(mm)
            } else {
                console.log('searchPlayers else:', data)
                callback([])
            }
        })
        .catch((error) => {
            console.error(error)
            callback([])
        })
}
