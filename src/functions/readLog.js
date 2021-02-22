import fs from 'fs'

import { getPlayersInfo } from './getPlayersInfo'

function getCurrentUser(lines) {
    for (let i = 0; i < lines.length; i++) {
        const row = lines[i]
        const m = row.match(/GAME -- Current user name is \[(.+)\]/)
        if (m) {
            return m[1]
        }
    }
}

function getLines(lines) {

    let arr = []
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

function switchTeams(info, currentUser) {
    const arr = info.filter(p => p.name === currentUser && p.profileId)

    if (arr.length !== 1 || arr[0].teamSlot === 0) {
        return info
    }

    for (let p of info) {
        p.teamSlot = p.teamSlot === '1' ? '0' : '1'
    }

    return info
}

export function readLog(fileLocation, callback) {
    console.log('readLog')
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error in reading logfile: ', err)
        }

        let lines = data.split('\n')

        let currentUser = getCurrentUser(lines)
        let arr = getLines(lines)
        let info = getPlayersInfo(arr)

        if (currentUser) {
            info = switchTeams(info, currentUser)
        }
        callback(info)
    })
}
