const axios = require('axios')
const fs = require('fs')

const fileLocation = 'C:\\Users\\Sergei\\Documents\\'
    + 'my games\\company of heroes 2\\warnings.log'

let lastPlayers = undefined
let extraInfo = undefined

function getLines(data) {
    let lines = data.split('\n')
    let arr = []
    let stop = false

    for (let i = lines.length - 1; i >= 0; i--) {
        const row = lines[i]
        if (row.match('GAME --.* Player:')) {
            arr.push(row)
        } else if (row.match('Match Started.*steam.*slot.*ranking')) {
            stop = true
            arr.push(row)
        } else if (stop) {
            break
        }
    }
    return arr
}

function getPlayersInfo(arr) {
    arr = arr.map(row => {
        let splited = row.split(':')
        return splited[splited.length - 1].trim()
    })

    let steamIds = {}
    let players = {}
    for (row of arr) {
        let id = row.match(/^.*\/steam\/(\d+).+/)
        let slot = row.match(/, slot = +(\d), ranking/)
        let ranking = row.match(/, ranking = +(-?\d+)/)
        if (
            id
            && slot
            && ranking
        ) {
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
            playerArr.pop()
            playerArr.pop()
            let name = playerArr.join(' ')
            players[slot] = {
                name,
                slot,
                faction,
            }
        }
    }
    //combine into one obj
    return Object.keys(players).map(key => {
        if (steamIds.hasOwnProperty(key)) {
            p = players[key]
            p.ranking = steamIds[key].ranking
            p.id = steamIds[key].id
            return p
        } else {
            p = players[key]
            p.ranking = '-1'
            return p
        }
    })

}

function addButton(text, parent, fun) {
    let div = document.createElement('div')
    div.classList.add('navbar')
    let button = document.createElement('button')
    button.textContent = text
    button.classList.add('button')
    button.onclick = () => {
        fun(lastPlayers)
    }
    div.appendChild(button)
    parent.appendChild(div)
}

function showBasicInfo(players) {
    let divInfo = document.querySelector('#info')
    divInfo.innerHTML = ''
    addButton('Extra info', divInfo, getExtraInfo)

    let team1 = document.createElement('div')
    team1.classList.add('team')
    let team2 = document.createElement('div')
    team2.classList.add('team')

    let table1 = document.createElement('table')
    let table2 = document.createElement('table')
    for (let i = 0; i < players.length; i++) {
        let tr = document.createElement('tr')
        const name = players[i].name
        // const id = players[i].id ? players[i].id : ''
        const ranking = players[i].ranking === '-1' ? '-' : players[i].ranking
        const faction = players[i].faction
        const slot = Number(players[i].slot)

        let tds = `
        <td class="ranking">${ranking}</td>
        <td class="faction">${getFactionName(faction)}</td>
        <td class="name">${name}</td>
        `
        tr.innerHTML = tds

        if (slot % 2 === 0) {
            table1.appendChild(tr)
        } else {
            table2.appendChild(tr)
        }
    }

    team1.appendChild(table1)
    team2.appendChild(table2)

    divInfo.appendChild(team1)
    divInfo.appendChild(team2)
}

function getFactionName(str) {
    switch (str) {
        case 'british':
            return 'Brits'
        case 'aef':
            return 'USA'
        case 'soviet':
            return 'Soviet'
        case 'west_german':
            return 'OKW'
        case 'german':
            return 'Wer'
        default:
            return '?????';
    }

}

function showExtraInfo() {
    // console.log(extraInfo)
    // console.log(lastPlayers)
    let teams = [[], []]
    console.log(lastPlayers)
    for (const p of lastPlayers) {
        let temp = Object.assign({}, p) // assign is for copying
        if (extraInfo[p.id]) {
            temp.ranks = extraInfo[p.id].ranks.sort(
                (a, b) => a.rank > b.rank ? 1 : -1
            )
        } else {
            temp.ranks = []
        }
        teams[temp.slot % 2].push(temp)
    }
    console.log(teams)

    let divInfo = document.querySelector('#info')
    divInfo.innerHTML = ''
    addButton('Basic info', divInfo, showBasicInfo)

    for (let i = 0; i < teams.length; i++) {
        let team = teams[i]

        let div = document.createElement('div')
        div.classList.add('team')


        let list = `<h3>Team ${i + 1}</h3>
        <hr>
        <table>
            <tr>
                <th>name</th>
                <th>rank</th>
                <th>mode</th>
            </tr>
           ${team.map(p => `
                <tr>
                    <td class="name">${p.name} (${getFactionName(p.faction)})</td>
                        ${p.ranks.map(r => `
                            <tr>
                                <td></td>
                                <td>${r.rank}</td>
                                <td>${r.name}</td>
                            </tr>
                        `).join('')}
                </tr>
            `).join('')} 
        </table>`
        div.innerHTML = list
        divInfo.appendChild(div)
    }
}

function getExtraInfo(players) {
    if (extraInfo) {
        showExtraInfo()
        return
    }

    let ids = players.filter(p => p.id != undefined).map(p => p.id)
    const strIds = ids.map(x => '%22%2Fsteam%2F' + x + '%22').join(',')

    const url = "https://coh2-api.reliclink.com/community/"
        + "leaderboard/GetPersonalStat?title=coh2&profile_names=["
        + strIds
        // + "%22%2Fsteam%2F76561198006675368%22,%22%2Fsteam%2F76561198370394140%22,%22%2Fsteam%2F76561198370394140%22,%22%2Fsteam%2F76561198021193151%22,%22%2Fsteam%2F76561198072062361%22"
        + "]"

    let leaderboard = undefined
    let cohTitles = undefined

    const fetch1 = axios.get(url)

    const url2 = "https://coh2-api.reliclink.com/"
        + "community/leaderboard/GetAvailableLeaderboards?title=coh2"

    const fetch2 = axios.get(url2)

    Promise.all([fetch1, fetch2])
    .then(values => {
        if (values[0].status === 200 && values[1].status === 200) {
            leaderboard = values[0].data
            cohTitles = values[1].data
            extraInfo = refactorData(leaderboard, cohTitles, ids)
            showExtraInfo()
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
    for (const id of ids)  {
        players[id] = {
            ranks: [],
        }
    }

    let statGroups = {}
    for (const x of leaderboard.statGroups)  {
        statGroups[x.id] = x
    }

    let names = {}
    for (const x of cohTitles.leaderboards)  {
        names[x.id] = x.name
    }

    for (const x of leaderboard.leaderboardStats.filter(l => l.rank > -1))  {
        // check members
        for (const member of statGroups[x.statGroup_id].members) {
            let steam_id = member.name.substring(7)
            if (
                players[steam_id]
                && !players[steam_id].ranks.find(y => 
                    y.statGroup_id === x.statGroup_id
                    && y.leaderboard_id === x.leaderboard_id
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
    console.log(players)
    return players
}

function readLog() {
    fs.readFile(fileLocation, "utf-8", (err, data) => {
        let arr = getLines(data)
        let players = getPlayersInfo(arr)
        if (
            JSON.stringify(players) 
            !== JSON.stringify(lastPlayers)
        ) {
            lastPlayers = players
            extraInfo = undefined
            console.log('new log')
            showBasicInfo(players)
        }
    })
}

readLog()
setInterval(() => {
    readLog()
}, 5000)