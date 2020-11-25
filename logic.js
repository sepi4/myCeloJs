const fs = require('fs')
const axios = require('axios')
let isReplay = true

// const fileLocation =
//     'C:\\Users\\Sergei\\Documents\\' +
//     'my games\\company of heroes 2\\warnings.log'

function getLines(data) {
    let lines = data.split('\n')
    let arr = []
    let stop = false
    let wasGame = false
    let wasNone = false
    isReplay = true

    for (let i = lines.length - 1; i >= 0; i--) {
        const row = lines[i]
        if (row.match('GAME --.* Player:')) {
            wasGame = true
            if (wasGame && wasNone) {
                break
            }
            arr.push(row)
        } else if (row.match('Match Started.*steam.*slot.*ranking')) {
            isReplay = false
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

function getPlayersInfo(arr) {
    arr = arr.map(row => {
        if (row.match(/GAME --.* Player:/)) {
            let splited = row.split(':')
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
            }
        }
    }
    //combine into one obj
    return Object.keys(players).map(key => {
        if (steamIds.hasOwnProperty(key)) {
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

function getExtraInfo(players, callback) {
    // let ids = players.filter(p => p.id != undefined).map(p => p.id)
    // const strIds = ids.map(x => '%22%2Fsteam%2F' + x + '%22').join(',')
    // const url =
    //     'https://coh2-api.reliclink.com/community/' +
    //     'leaderboard/GetPersonalStat?title=coh2&profile_names=[' +
    //     strIds +
    //     // + "%22%2Fsteam%2F76561198006675368%22,%22%2Fsteam%2F76561198370394140%22,%22%2Fsteam%2F76561198370394140%22,%22%2Fsteam%2F76561198021193151%22,%22%2Fsteam%2F76561198072062361%22"
    //     ']'

    let ids = players.filter(p => p.profileId != undefined)
        .map(p => p.profileId)
        
    const url = 'https://coh2-api.reliclink.com/community/'
        + 'leaderboard/GetPersonalStat?title=coh2&profile_ids=['
        + ids.join(',') + ']'


    let leaderboard = undefined
    let cohTitles = undefined

    const fetch1 = axios.get(url)

    const url2 =
        'https://coh2-api.reliclink.com/' +
        'community/leaderboard/GetAvailableLeaderboards?title=coh2'

    const fetch2 = axios.get(url2)

    Promise.all([fetch1, fetch2])
        .then(values => {
            if (values[0].status === 200 && values[1].status === 200) {
                leaderboard = values[0].data
                cohTitles = values[1].data
                let result = refactorData(leaderboard, cohTitles, ids)
                callback(result, isReplay)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

function refactorData(leaderboard, cohTitles, ids) {
    // leaderboard:
    //         -leaderboardStats: []
    //                  - statGroup_id
    //                  - leaderboard_id
    //                  - rank
    //          -statGroups: []
    //                      - id
    //                      - members: []
    //                              - name (steam id)
    //                              - alias
    //                              - personal_statgroup_id

    // cohTitles:
    //         -leaderboards: []
    //             - id
    //             - name

    let players = {}
    for (const id of ids) {
        players[id] = {
            ranks: [],
        }
    }
    // console.log('players:', players)

    let statGroups = {}
    for (const x of leaderboard.statGroups) {
        statGroups[x.id] = x
    }

    let names = {}
    for (const x of cohTitles.leaderboards) {
        names[x.id] = x.name
    }

    for (const x of leaderboard.leaderboardStats.filter(l => l.rank > -1)) {
        // check members
        for (const member of statGroups[x.statGroup_id].members) {
            // console.log('member:', member)
            // let steam_id = member.name.substring(7)
            let steam_id = member.profile_id
            if (
                players[steam_id] &&
                !players[steam_id].ranks.find(
                    y =>
                        y.statGroup_id === x.statGroup_id &&
                        y.leaderboard_id === x.leaderboard_id,
                )
            ) {
                players[steam_id].ranks.push({
                    statGroup_id: x.statGroup_id,
                    rank: x.rank,
                    members: statGroups[x.statGroup_id].members,
                    name: names[x.leaderboard_id],
                    leaderboard_id: x.leaderboard_id,
                })
                break
            }
        }
    }

    // if (isReplay) {
    //     console.log('isReplay')
    //     console.log(players)
    // } else {
    //     console.log('NO Replay')
    //     console.log(players)
    // }
    return players
}


function getFactionFlag(str) {
    function img(s) {
        return `<img class="flag" src="./img/${s}.png" alt="${s}">`
    }
    return commonName(str, img)
}

function obsFaction(str) {
    return commonName(str)
}

function commonName(str) {
    switch (str) {
        case 'british':
            return 'uk'
        case 'aef':
            return 'usa'
        case 'soviet':
            return 'sov'
        case 'west_german':
            return 'okw'
        case 'german':
            return 'wer'
        default:
            return '?????'
    }
}

function writeRankings(players, fileLocation) {
    let str1 = ''
    let str2 = ''
    for (let i = 0; i < players.length; i++) {
        const name = players[i].name
        const ranking = players[i].ranking === '-1' ? '-' : players[i].ranking
        const faction = players[i].faction
        const slot = Number(players[i].slot)

        if (slot % 2 === 0) {
            str1 += `${ranking.padEnd(5)} ${obsFaction(faction).padEnd(5)} ${name}\n`
        } else {
            str2 += `${ranking.padEnd(5)} ${obsFaction(faction).padEnd(5)} ${name}\n`
        }
    }

    console.log('writeRankings: ', fileLocation)
    fs.writeFile(
        fileLocation,
        str1 + '\n' + str2,
        'utf-8',
        (err) => {
            console.log('Error in writing rankings.txt file: ', err)
        },
    )
}

function readLog(fileLocation, callback) {
    console.log('readLog')
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) return
        let arr = getLines(data)
        callback(getPlayersInfo(arr))
    })
}

module.exports = {
    readLog,
    getLines,
    getPlayersInfo,
    getExtraInfo,
    writeRankings,
    getFactionFlag,
    commonName,
    React,
    ReactDOM,
}
