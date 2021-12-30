import { Player } from '../../types'
/**
 *
 * // example row
 * // 21:01:16.90   GAME -- Human Player: 2 sepi 580525 0 soviet
 *
 * @param arr string arr from warnings.log with players data
 * @returns  arr of players objects
 */
export function getPlayersInfo(arr: string[]): Player[] {
    let time: string | undefined

    const playersData: string[] = arr.map((row) => {
        if (row.match(/GAME --.* Player:/)) {
            const splitted = row.split(':')
            if (time === undefined) {
                time = [
                    splitted[0],
                    splitted[1],
                    splitted[2].split('   ')[0],
                ].join(':')
            }

            return splitted.slice(3).join(':').trim()
        } else {
            const splited = row.split(':')
            return splited[splited.length - 1].trim()
        }
    })

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

        if (slot && faction && teamSlot && time) {
            players[slot] = {
                faction,
                name,
                profileId: profileId === undefined ? -1 : Number(profileId),
                teamSlot: teamSlot === undefined ? -1 : Number(teamSlot),
                time,
            }
        }
    }

    //combine into one obj
    return Object.keys(players).map((key) => {
        const p = players[key]
        p.ranking = -1
        return p
    })
}
