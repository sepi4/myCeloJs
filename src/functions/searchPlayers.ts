import axios from 'axios'

import { RELIC_SERVER_BASE } from '../constants'

type Result = {
    status: number
    data: any // TODO
}
type Player = {
    id: number
    type: number
    name: string
    members: any[] // TODO
}

export default function searchPlayers(
    searchValue: string,
    // TODO
    callback: (res: any[]) => void
) {
    const url = `${RELIC_SERVER_BASE}/GetPersonalStat?title=coh2&search=${searchValue}`

    axios
        .get(url)
        .then((result: Result) => {
            if (
                result.status === 200 &&
                result.data.result.message === 'SUCCESS'
            ) {
                let playerArr: Player[] = result.data.statGroups.filter(
                    (p: Player) => p.type === 1
                )

                playerArr = playerArr.map((p: Player) => p.members[0])
                callback(playerArr)
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
