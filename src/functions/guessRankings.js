import { 
    copyObj,
    formatToNums,
    separateTeams,
    getFactionName,
} from '../functions/simpleFunctions'

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
    return data.leaderboardStats.filter(ls => ls.statgroup_id === sg.id )
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


function getTitlesLeaderboardId(name, titles) {
    let obj = titles.leaderboards.find(obj => obj.name === name)
    return obj.id
}


function getPlayerStatGroupId(playerId, data) {

    let p = data.statGroups.find(obj => ( obj.type === 1
        && obj.members[0].profile_id === playerId
    ))
    if (p) {
        return p.id
    }
}

function getPlayerLeaderboardStat(statGroupId, leaderboardId, data) {
    return data.leaderboardStats.find(obj => (
        obj.statgroup_id === statGroupId
        && obj.leaderboard_id === leaderboardId
    ))
}

export function guessRankings(playersArr, data, titles) {
    // debugger
    let arr = formatToNums(copyObj(playersArr))
    let teams = separateTeams(arr)
    for (const team of teams) {
        const side = factionSide(team)
        const titleName = getTitleName(team, side)
        const statGroup = findTeamStatGroup(team, data)
        // debugger
        if (statGroup && team.length > 1) {
            const titleId = getTitleId(titleName, titles)
            let teamLeaderboardStats = findTeamLeaderboardStats(
                statGroup, 
                data,
            )
            teamLeaderboardStats = filterDublicateLeaderboardStats(
                teamLeaderboardStats)
            let teamCurrentLeaderboardStat = teamLeaderboardStats
                .find(x => x.leaderboard_id === titleId)
            if (teamCurrentLeaderboardStat && teamCurrentLeaderboardStat.rank) {
                team.forEach(
                    obj => obj.ranking = teamCurrentLeaderboardStat.rank)
            }
        } else {
            for (let player of team) {
                let s = team.length
                let fn = getFactionName(player.faction)
                let matchTypeName = `${s}v${s}${fn}`
                let leaderboardId = getTitlesLeaderboardId(
                    matchTypeName, titles)

                let playerId = player.profileId
                if (playerId === undefined) {
                    continue
                }


                let playerStatGroupId = getPlayerStatGroupId(playerId, data)
                let pls = getPlayerLeaderboardStat(
                    playerStatGroupId, leaderboardId, data)
                if (pls && pls.rank) {
                    player.ranking = pls.rank
                }
            }
        }
    }

    // getting country to player
    for (let t of teams) {
        for (const player of t) {
            if (player.profileId) {
                for (let sg of data.statGroups) {
                    for (let m of sg.members) {
                        if (m.profile_id === player.profileId) {
                            player.country = m.country
                            break
                        }
                    }
                    if (player.country) {
                        break
                    }
                }
            }
        }
    }
    return teams
}