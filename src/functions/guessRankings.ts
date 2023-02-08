import {
    copyObj,
    formatToNums,
    separateTeams,
    getFactionName,
} from './simpleFunctions'

import {
    Player,
    AvailableLeaderboard,
    PersonalStats,
    StatGroup,
    LeaderboardStat,
} from '../types'

function getStatGrops(team: Player[], data: PersonalStats) {
    const len = team.length
    for (let i = len; i > 1; i--) {
        const statGroups = data.statGroups
            .filter((s) => s.type === i)
            .filter((s) =>
                s.members.every((el) =>
                    team.find((m) => m.profileId === el.profile_id)
                )
            )

        if (statGroups.length >= 1) {
            return statGroups
        }
    }
    return []
}

function addRankToTeamLeaderboardStats(
    statGroups: StatGroup[],
    data: PersonalStats,
    leaderboardId: number | undefined
) {
    const arr: LeaderboardStat[] = []
    let teamIndex = 1
    data.leaderboardStats.forEach((ls: LeaderboardStat) => {
        statGroups.forEach((sg) => {
            if (
                ls.statgroup_id === sg.id &&
                ls.leaderboard_id === leaderboardId &&
                !arr.find(
                    // no duplicates
                    (x) =>
                        x.statgroup_id === ls.statgroup_id &&
                        x.leaderboard_id === ls.leaderboard_id
                )
            ) {
                arr.push(ls)
                let teamMarker
                if (teamIndex === 1) {
                    teamMarker = ' ¹'
                } else {
                    teamMarker = ' ²'
                }

                sg.rank = ls.rank
                sg.teamMarker = teamMarker
                teamIndex++
            }
        })
    })
}

function factionSide(team: Player[]) {
    const isAllies = team.every(
        (p) =>
            p.faction === 'british' ||
            p.faction === 'aef' ||
            p.faction === 'soviet'
    )

    const isAxis = team.every(
        (p) => p.faction === 'west_german' || p.faction === 'german'
    )

    if (isAllies) {
        return 'allies'
    } else if (isAxis) {
        return 'axis'
    } else {
        return undefined
    }
}

function getTitleName(teamLen: number, side: string | undefined) {
    const size = teamLen
    if (side === undefined) {
        return undefined
    }
    if (size < 2) {
        return undefined
    }
    if (side === 'allies') {
        return 'TeamOf' + size + 'Allies'
    } else if (side === 'axis') {
        return 'TeamOf' + size + 'Axis'
    }
}

function getLeaderboardId(
    titleName: string | undefined,
    titles: AvailableLeaderboard
) {
    const obj = titles.leaderboards.find((t) => t.name === titleName)
    if (obj) {
        return obj.id
    }
}

function getTitlesLeaderboardId(name: string, titles: AvailableLeaderboard) {
    const obj = titles.leaderboards.find((obj) => obj.name === name)
    if (obj) {
        return obj.id
    }
}

function getPlayerStatGroup(playerId: number | undefined, data: PersonalStats) {
    if (playerId) {
        return data.statGroups.find(
            (obj) => obj.type === 1 && obj.members[0].profile_id === playerId
        )
    }
}

function getPlayerLeaderboardStat(
    statGroupId: number | undefined,
    leaderboardId: number | undefined,
    data: PersonalStats
) {
    return data.leaderboardStats.find(
        (obj) =>
            obj.statgroup_id === statGroupId &&
            obj.leaderboard_id === leaderboardId
    )
}

function findInStatGroups(statGroups: StatGroup[], player: Player) {
    for (const sg of statGroups) {
        for (const m of sg.members) {
            if (m.profile_id === player.profileId) {
                return sg
            }
        }
    }
}

export function guessRankings(
    playersArr: Player[],
    data: PersonalStats,
    titles: AvailableLeaderboard
) {
    function rankToRandomPlayer(team: Player[], player: Player) {
        const teamSize = team.length
        const factionName = getFactionName(player.faction)
        const matchTypeName = `${teamSize}v${teamSize}${factionName}`
        const leaderboardId = getTitlesLeaderboardId(matchTypeName, titles)

        const playerId = player.profileId
        const playerStatGroup = getPlayerStatGroup(playerId, data)

        let playerStatGroupId
        if (playerStatGroup) {
            playerStatGroupId = playerStatGroup.id
        }

        const playerLeaderboardStat = getPlayerLeaderboardStat(
            playerStatGroupId,
            leaderboardId,
            data
        )

        if (playerLeaderboardStat?.rank) {
            player.ranking = playerLeaderboardStat.rank
        }
    }

    const arr: Player[] = formatToNums(copyObj(playersArr))
    const teams: [Player[], Player[]] = separateTeams(arr)

    for (const team of teams) {
        const side = factionSide(team)
        const statGroups = getStatGrops(team, data)

        if (statGroups.length > 0 && team.length > 1) {
            const modeName = getTitleName(statGroups[0].members.length, side)
            const leaderboardId = getLeaderboardId(modeName, titles)
            addRankToTeamLeaderboardStats(statGroups, data, leaderboardId)
            team.forEach((player) => {
                const sg = findInStatGroups(statGroups, player)
                if (sg) {
                    player.ranking = sg.rank
                    player.teamMarker = sg.teamMarker
                } else {
                    rankToRandomPlayer(team, player)
                }
            })
        } else {
            for (const player of team) {
                rankToRandomPlayer(team, player)
            }
        }
    }

    // adding country to player
    for (const t of teams) {
        for (const player of t) {
            if (player.profileId) {
                for (const sg of data.statGroups) {
                    for (const m of sg.members) {
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
