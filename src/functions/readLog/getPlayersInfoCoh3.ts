import { Player } from '../../types'


// TODO: ADD EXAMPLES
/**
 *
 * @param arr string arr from warnings.log with players data
 * @returns  arr of players objects
 */
export function getPlayersInfoCoh3(arr: string[]): Player[] {
    let time: string | undefined

    const playersData: string[] = arr.map((row) => {
        if (row.match(/GAME --.* Player:/)) {
            const splitted = row.split(':')
            if (time === undefined) {
                time = [
                    splitted[0],
                    splitted[1],
                    splitted[2],
                ].join(':')
            }

            return splitted.slice(4).join(':').trim()
        } else {
            const splited = row.split(':')
            return splited[splited.length - 1].trim()
        }
    })

    const ooo: any = {}
    for (const row of playersData) {
        const p = parse(row)
        if (p?.profileId) {
            ooo[p.profileId + ''] = p
        }
    }

    const players: {
        [key: string]: Player
    } = {}

    for (const pData of playersData) {
        const playerArr: string[] = pData.split(' ')
        const slot: string | undefined = playerArr.shift()

        const faction: string | undefined = playerArr.pop()
        const teamSlot: string | undefined = playerArr.pop()
        const profileId: string | undefined = playerArr.pop()
        const name: string = playerArr.join(' ')

        if (slot && faction && teamSlot && time && Number(profileId)) {
            const pid = Number(profileId)
            players[slot] = {
                faction,
                name,
                profileId: profileId === undefined ? -1 : pid,
                teamSlot: teamSlot === undefined ? -1 : Number(teamSlot),
                time,
                ranking: ooo[pid].ranking,
            }
        }
    }

    //combine into one obj
    return Object.keys(players).map((key) => {
        const p = players[key]
        return p
    })
}


function parse(row: string) {
    const m = row.match(/Match Started - \[(\d+) \/steam\/(\d+)\], slot = +(\d+), ranking = +(-?\d+)/)
    if (m) {
        return {
            profileId: Number(m[1]),
            steamId: Number(m[2]),
            slot: Number(m[3]),
            ranking: Number(m[4]),
        }
    }
}
