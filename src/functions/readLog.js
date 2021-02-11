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

function getLines(data) {
    let lines = data.split('\n')
    let currentUser = getCurrentUser(lines)
    // console.log('currentUser:', currentUser)
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

export function readLog(fileLocation, callback) {
    console.log('readLog')
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error in reading logfile: ', err)
        }
        let arr = getLines(data)
        callback(getPlayersInfo(arr))
    })
}