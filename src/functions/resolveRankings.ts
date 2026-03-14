import { AvailableLeaderboard, PersonalStats, Player, StatGroup } from '../types'
import { getFactionName } from './factionMappings'
import { formatToNums, separateTeams } from './simpleFunctions'

const ALLIES_FACTIONS = ['british', 'aef', 'soviet']
const AXIS_FACTIONS = ['west_german', 'german']

function findLeaderboardId(
    name: string | undefined,
    leaderboards: AvailableLeaderboard
): number | undefined {
    return leaderboards.leaderboards.find((lb) => lb.name === name)?.id
}

function getTeamStatGroups(team: Player[], stats: PersonalStats): StatGroup[] {
    for (let size = team.length; size > 1; size--) {
        const groups = stats.statGroups
            .filter((sg) => sg.type === size)
            .filter((sg) => sg.members.every((m) => team.some((p) => p.profileId === m.profile_id)))

        if (groups.length > 0) {
            return groups
        }
    }
    return []
}

function getTeamLeaderboardName(teamSize: number, team: Player[]): string | undefined {
    if (teamSize < 2) {
        return undefined
    }

    const isAllies = team.every((p) => ALLIES_FACTIONS.includes(p.faction))
    const isAxis = team.every((p) => AXIS_FACTIONS.includes(p.faction))

    if (isAllies) {
        return `TeamOf${teamSize}Allies`
    }
    if (isAxis) {
        return `TeamOf${teamSize}Axis`
    }
    return undefined
}

function assignTeamRanks(
    statGroups: StatGroup[],
    stats: PersonalStats,
    leaderboardId: number | undefined
): void {
    statGroups.forEach((sg, i) => {
        sg.teamMarker = i === 0 ? ' ¹' : ' ²'
    })

    for (const ls of stats.leaderboardStats) {
        if (ls.leaderboard_id !== leaderboardId) {
            continue
        }
        const matchedSg = statGroups.find((sg) => sg.id === ls.statgroup_id)
        if (matchedSg) {
            matchedSg.rank = ls.rank
        }
    }
}

function getPlayerRank(
    player: Player,
    team: Player[],
    stats: PersonalStats,
    leaderboards: AvailableLeaderboard
): number | undefined {
    const matchTypeName = `${team.length}v${team.length}${getFactionName(player.faction)}`
    const leaderboardId = findLeaderboardId(matchTypeName, leaderboards)

    const playerSg = stats.statGroups.find(
        (sg) => sg.type === 1 && sg.members[0].profile_id === player.profileId
    )

    const rank = stats.leaderboardStats.find(
        (ls) => ls.statgroup_id === playerSg?.id && ls.leaderboard_id === leaderboardId
    )?.rank

    if (rank !== undefined) {
        return rank
    }

    // Fallback to unranked leaderboard (COH3 has both ranked and unranked variants)
    const unrankedId = findLeaderboardId(matchTypeName + 'Unranked', leaderboards)
    return stats.leaderboardStats.find(
        (ls) => ls.statgroup_id === playerSg?.id && ls.leaderboard_id === unrankedId
    )?.rank
}

function findPlayerCountry(player: Player, stats: PersonalStats): string | undefined {
    for (const sg of stats.statGroups) {
        const member = sg.members.find((m) => m.profile_id === player.profileId)
        if (member) {
            return member.country
        }
    }
}

export function resolveRankings(
    playersArr: Player[],
    stats: PersonalStats,
    leaderboards: AvailableLeaderboard
) {
    const players: Player[] = formatToNums(structuredClone(playersArr))
    const teams: [Player[], Player[]] = separateTeams(players)

    for (const team of teams) {
        const statGroups = getTeamStatGroups(team, stats)

        if (statGroups.length > 0) {
            const leaderboardName = getTeamLeaderboardName(statGroups[0].members.length, team)
            const leaderboardId = findLeaderboardId(leaderboardName, leaderboards)
            assignTeamRanks(statGroups, stats, leaderboardId)

            for (const player of team) {
                const playerSg = statGroups.find((sg) =>
                    sg.members.some((m) => m.profile_id === player.profileId)
                )
                if (playerSg) {
                    player.ranking =
                        playerSg.rank ?? getPlayerRank(player, team, stats, leaderboards)
                    player.teamMarker = playerSg.teamMarker
                } else {
                    player.ranking = getPlayerRank(player, team, stats, leaderboards)
                }
            }
        } else {
            for (const player of team) {
                player.ranking = getPlayerRank(player, team, stats, leaderboards)
            }
        }
    }

    for (const team of teams) {
        for (const player of team) {
            if (player.profileId) {
                player.country = findPlayerCountry(player, stats)
            }
        }
    }

    return teams
}
