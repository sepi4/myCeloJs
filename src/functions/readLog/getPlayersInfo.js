
export function getPlayersInfo(arr) {
    let time
    arr = arr.map(row => {
        if (row.match(/GAME --.* Player:/)) {
            let splited = row.split(':')
            if (time === undefined) {
                time = [splited[0], splited[1], splited[2].split('   ')[0]]
                    .join(':')
            }

            return splited.slice(3).join(':').trim()
        } else {
            let splited = row.split(':')
            return splited[splited.length - 1].trim()
        }
    })

    let steamIds = {}
    let players = {}
    for (let row of arr) {
        let id = row.match(/^.*\/steam\/(\d+).+/)
        let slot = row.match(/, slot = +(\d), ranking/)
        let ranking = row.match(/, ranking = +(-?\d+)/)
        if (id && slot && ranking) {
            id = id[1]
            slot = slot[1]
            ranking = ranking[1]
            steamIds[slot] = {
                id,
                slot,
                ranking,
                time,
            }
        } else {
            let playerArr = row.split(' ')
            slot = playerArr.shift()
            let faction = playerArr.pop()
            let teamSlot = playerArr.pop()
            let profileId = playerArr.pop()
            let name = playerArr.join(' ')
            players[slot] = {
                teamSlot,
                profileId,
                name,
                slot,
                faction,
                time,
            }
        }
    }

    //combine into one obj
    return Object.keys(players).map(key => {
        if (steamIds[key]) {
            let p = players[key]
            p.ranking = steamIds[key].ranking
            p.id = steamIds[key].id
            return p
        } else {
            let p = players[key]
            p.ranking = '-1'
            return p
        }
    })
}