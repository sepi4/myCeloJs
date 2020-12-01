const { data, titles } = require('./data')

let arr = [
    { "teamSlot": "0", "profileId": "42102", "name": "SlayeR", "slot": "0", "faction": "soviet", "ranking": "-1" },
    { "teamSlot": "1", "profileId": "163073", "name": "Ping me always please", "slot": "1", "faction": "german", "ranking": "-1" },
    { "teamSlot": "0", "profileId": "580525", "name": "sepi", "slot": "2", "faction": "aef", "ranking": "-1" },
    { "teamSlot": "1", "profileId": "106866", "name": "StephennJF", "slot": "3", "faction": "german", "ranking": "-1" }
]


function separateTeams(arr) {
    let teams = [[], []]
    for (let obj of arr) {
        if (obj.teamSlot === 0) {
            teams[0].push(obj)
        } else {
            teams[1].push(obj)
        }
    }
    return teams
}

function formatToNums(arr) {
    for (let obj of arr) {
        for (let key of Object.keys(obj)) {
            if (!isNaN(obj[key])) {
                obj[key] = +obj[key]
            }
        }
    }
    return arr
}

function findTeamStatGroup(team, data) {
    // filter type
    let statGroups = data.statGroups
        .filter(s => s.type == team.length)
        .filter(s => s.members
            .every(el => team.find(m => m.profileId === el.profile_id)
        )
    )

    if (statGroups.length === 1) {
        return statGroups[0]
    } else {
        return undefined
    }
}

function findTeamLeaderboardStats(sg, data) {
    return data.leaderboardStats.filter(ls => ls.statGroup_id === sg.id )
}

function filterDublicateLeaderboardStats(arr) {
    let newArr = []
    for (const ls of arr) {
        if (!newArr.find(x => x.statGroup_id === ls.statGroup_id
            && x.leaderboard_id === ls.leaderboard_id)
        ) {
            newArr.push(ls)
        }
    }
    return newArr
}

function factionSide(team) {
    const isAllies = team.every(p => (
        p.faction === 'british'
        || p.faction === 'aef'
        || p.faction === 'soviet'))

    const isAxis = team.every(p => (
        p.faction === 'west_german'
        || p.faction === 'german'))
    
    if (isAllies) {
        return 'allies'
    } else if (isAxis) {
        return 'axis'
    } else {
        return undefined
    }
}

function getTitleName(team, side) {
    let size =  team.length
    if (size < 2) {
        return undefined
    }
    if (side === 'allies') {
        return 'TeamOf' + size + 'Allies'
    } else if (side === 'axis') {
        return 'TeamOf' + size + 'Axis'
    }
}

function getTitleId(titleName, titles) {
    let obj = titles.leaderboards.find(t => t.name === titleName)
    if (obj) {
        return obj.id
    }
}

function getFactionName(x) {
    switch (x) {
        case 'soviet':
            return 'Soviet'
        case 'german':
            return 'German'
        case 'aef':
            return 'AEF'
        case 'british':
            return 'British'
        case 'west_german':
            return 'WestGerman'
        default:
            return undefined
    }
}

function getTitlesLeaderboardId(name, titles) {
    let obj = titles.leaderboards.find(obj => obj.name === name)
    return obj.id
}

function getPlayerLeaderboardStat(leaderboardId, playerId, data) {
    let obj = data.leaderboardStats.find(obj => (

    ))
    return obj.id
}


arr = formatToNums(arr)
const teams = separateTeams(arr)
for (const team of teams) {
    const side = factionSide(team)
    const titleName = getTitleName(team, side)
    const statGroup = findTeamStatGroup(team, data)
    if (statGroup) {
        const titleId = getTitleId(titleName, titles)
        let teamLeaderboardStats = findTeamLeaderboardStats(statGroup, data)
        teamLeaderboardStats = filterDublicateLeaderboardStats(
            teamLeaderboardStats)
        let teamCurrentLeaderboardStat = teamLeaderboardStats
            .find(x => x.leaderboard_id === titleId)
        const rank = teamCurrentLeaderboardStat.rank
        if (rank) {
            team.forEach(obj => obj.ranking = rank)
        }
    } else {
        // TODO: if not team
        for (const player of team) {
            let s = team.length
            let fn = getFactionName(player.faction)
            let matchTypeName = `${s}v${s}${fn}`
            let leaderboardId = getTitlesLeaderboardId(matchTypeName, titles)

            console.log(player)
            console.log(matchTypeName)
            console.log(leaderboardId)
        }
    }
    // console.log(team)
}


