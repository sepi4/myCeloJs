import {
    copyObj,
    formatToNums,
    separateTeams,
    getFactionName,
} from '../functions/simpleFunctions'

function getStatGrops(team, data) {
    const len = team.length
    for (let i = len; i > 1; i--) {
        let statGroups = data.statGroups
            .filter(s => s.type === i)
            .filter(s => s.members
                .every(el => team
                    .find(m => m.profileId === el.profile_id)
                )
            )

        if (statGroups.length >= 1) {
            return statGroups
        }

    }
    return []
}

function addRankToTeamLeaderboardStats(statGroups, data, leaderboardId) {
    // console.log('statGropus', statGroups)
    // console.log('leaderboardId', leaderboardId)
    // console.log('data.leaderboardStats: ', data.leaderboardStats)
    let arr = []
    let teamIndex = 1
    data.leaderboardStats.forEach(ls => {
        statGroups.forEach(sg => {
            if (
                ls.statgroup_id === sg.id
                && ls.leaderboard_id === leaderboardId
                && !arr.find( // no dublicates
                    x => x.statgroup_id === ls.statgroup_id
                        && x.leaderboard_id === ls.leaderboard_id
                )
            ) {
                arr.push(ls)
                // sg.rank = ls.rank + ' :t' + (i + 1)
                let teamMarker
                if (teamIndex === 1) {
                    teamMarker = ' ¹'
                } else {
                    teamMarker = ' ²'
                }

                if (!ls.rank || ls.rank < 1) {
                    ls.rank = '-'
                }

                sg.rank = ls.rank + teamMarker
                teamIndex++
            }
        })
    })
    return arr
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

function getTitleName(teamLen, side) {
    let size = teamLen
    if (size < 2) {
        return undefined
    }
    if (side === 'allies') {
        return 'TeamOf' + size + 'Allies'
    } else if (side === 'axis') {
        return 'TeamOf' + size + 'Axis'
    }
}

function getLeaderboardId(titleName, titles) {
    let obj = titles.leaderboards.find(t => t.name === titleName)
    if (obj) {
        return obj.id
    }
}

function getTitlesLeaderboardId(name, titles) {
    let obj = titles.leaderboards.find(obj => obj.name === name)
    return obj.id
}

function getPlayerStatGroup(playerId, data) {
    return data.statGroups.find(obj => (obj.type === 1
        && obj.members[0].profile_id === playerId
    ))
}

function getPlayerLeaderboardStat(statGroupId, leaderboardId, data) {
    return data.leaderboardStats.find(obj => (
        obj.statgroup_id === statGroupId
        && obj.leaderboard_id === leaderboardId
    ))
}

function findInStatGroups(statGroups, player) {
    for (const sg of statGroups) {
        for (const m of sg.members) {
            if (m.profile_id === player.profileId) {
                return sg
            }
        }
    }
    return false
}

export function guessRankings(playersArr, data, titles) {
    function rankToRandomPlayer(team, player) {
        let s = team.length
        let fn = getFactionName(player.faction)
        let matchTypeName = `${s}v${s}${fn}`
        let leaderboardId = getTitlesLeaderboardId(
            matchTypeName, titles)

        let playerId = player.profileId
        let playerStatGroup = getPlayerStatGroup(playerId, data)

        let playerStatGroupId
        if (playerStatGroup) {
            playerStatGroupId = playerStatGroup.id
        }

        let pls = getPlayerLeaderboardStat(
            playerStatGroupId, leaderboardId, data)
        if (pls && pls.rank) {
            player.ranking = pls.rank
        }
    }

    let arr = formatToNums(copyObj(playersArr))
    let teams = separateTeams(arr)
    for (const team of teams) {
        const side = factionSide(team)
        const statGroups = getStatGrops(team, data)
        if (statGroups.length > 0 && team.length > 1) {
            const modeName = getTitleName(statGroups[0].members.length, side)
            const leaderboardId = getLeaderboardId(modeName, titles)
            addRankToTeamLeaderboardStats(
                statGroups,
                data,
                leaderboardId,
            )
            team.forEach(player => {
                const sg = findInStatGroups(statGroups, player)
                if (sg) {
                    player.ranking = sg.rank
                } else {
                    rankToRandomPlayer(team, player)
                }
            })
        } else {
            for (let player of team) {
                rankToRandomPlayer(team, player)
            }
        }
    }

    // adding country to player
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