// import fs from 'fs/promises'
import { promises as fs } from 'fs'

import { getPlayersInfo } from './getPlayersInfo'
import { Player } from '../../types'

export function getCurrentUserAlias(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
        const row = lines[i]
        const m = row.match(/GAME -- Current user name is \[(.+)\]/)
        if (m) {
            return m[1]
        }
    }
}

export function getLines(lines: string[]) {
    const arr: string[] = []
    let stop = false
    let wasGame = false
    let wasNone = false

    for (let i = lines.length - 1; i >= 0; i--) {
        const row = lines[i]
        if (row.match('GAME --.* Player:')) {
            wasGame = true
            if (wasGame && wasNone) {
                break
            }
            arr.push(row)
        } else if (row.match('Match Started.*steam.*slot.*ranking')) {
            stop = true
            arr.push(row)
        } else if (stop) {
            break
        } else if (wasGame) {
            wasNone = true
        }
    }

    return arr
}

/**
 * Switch players so that current player is in first team
 * @param info players info arr
 * @param currentUser current user
 * @returns modified players info arr
 */
export function switchTeams(info: Player[], currentUser: string): Player[] {
    const currentUserTeam: Player[] = info.filter(
        (p) => p.name === currentUser && p.profileId
    )

    if (currentUserTeam.length !== 1 || currentUserTeam[0].teamSlot === 0) {
        return info
    }

    for (const p of info) {
        p.teamSlot = p.teamSlot === 1 ? 0 : 1
    }

    return info
}

export async function readLog(
    fileLocation: string
    // callback: (info: Player[]) => void
) {
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    try {
        const data = await fs.readFile(fileLocation, 'utf-8')
        const lines = data.split('\n')

        const currentUserAlias: string | undefined = getCurrentUserAlias(lines)

        const arr: string[] = getLines(lines)
        let psInfo = getPlayersInfo(arr)

        if (currentUserAlias) {
            psInfo = switchTeams(psInfo, currentUserAlias)
        }
        // callback(psInfo)
        return new Promise<Player[]>((resolve, reject) => {
            resolve(psInfo)
            // if (psInfo) {
            // } else {
            //     reject()
            // }
        })
    } catch (err) {
        if (err) {
            console.log('Error in reading logfile: ', err)
        }
    }
}
