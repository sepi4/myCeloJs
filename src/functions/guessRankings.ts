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
} from '../types'

const ALLIES_FACTIONS = ['british', 'aef', 'soviet']
const AXIS_FACTIONS = ['west_german', 'german']

function findLeaderboardId(
    name: string | undefined,
    titles: AvailableLeaderboard
): number | undefined {
    return titles.leaderboards.find((lb) => lb.name === name)?.id
}

function getTeamStatGroups(team: Player[], data: PersonalStats): StatGroup[] {
    for (let size = team.length; size > 1; size--) {
        const groups = data.statGroups
            .filter((sg) => sg.type === size)
            .filter((sg) =>
                sg.members.every((m) =>
                    team.some((p) => p.profileId === m.profile_id)
                )
            )

        if (groups.length > 0) return groups
    }
    return []
}

function getTeamLeaderboardName(
    teamSize: number,
    team: Player[]
): string | undefined {
    if (teamSize < 2) return undefined

    const isAllies = team.every((p) => ALLIES_FACTIONS.includes(p.faction))
    const isAxis = team.every((p) => AXIS_FACTIONS.includes(p.faction))

    if (isAllies) return `TeamOf${teamSize}Allies`
    if (isAxis) return `TeamOf${teamSize}Axis`
    return undefined
}

function assignTeamRanks(
    statGroups: StatGroup[],
    data: PersonalStats,
    leaderboardId: number | undefined
): void {
    const seen = new Set<number>()
    let teamIndex = 1

    for (const ls of data.leaderboardStats) {
        if (ls.leaderboard_id !== leaderboardId) continue

        const sg = statGroups.find((sg) => sg.id === ls.statgroup_id)
        if (!sg || seen.has(ls.statgroup_id)) continue

        seen.add(ls.statgroup_id)
        sg.rank = ls.rank
        sg.teamMarker = teamIndex === 1 ? ' ¹' : ' ²'
        teamIndex++
    }
}

function getSolo1v1Rank(
    player: Player,
    team: Player[],
    data: PersonalStats,
    titles: AvailableLeaderboard
): number | undefined {
    const matchTypeName = `${team.length}v${team.length}${getFactionName(player.faction)}`
    const leaderboardId = findLeaderboardId(matchTypeName, titles)

    const playerSg = data.statGroups.find(
        (sg) => sg.type === 1 && sg.members[0].profile_id === player.profileId
    )

    const rank = data.leaderboardStats.find(
        (ls) =>
            ls.statgroup_id === playerSg?.id &&
            ls.leaderboard_id === leaderboardId
    )?.rank

    if (rank !== undefined) return rank

    // Fallback to unranked leaderboard (COH3 has both ranked and unranked variants)
    const unrankedId = findLeaderboardId(matchTypeName + 'Unranked', titles)
    return data.leaderboardStats.find(
        (ls) =>
            ls.statgroup_id === playerSg?.id &&
            ls.leaderboard_id === unrankedId
    )?.rank
}

function findPlayerCountry(
    player: Player,
    data: PersonalStats
): string | undefined {
    for (const sg of data.statGroups) {
        const member = sg.members.find((m) => m.profile_id === player.profileId)
        if (member) return member.country
    }
}

export function guessRankings(
    coh3: boolean,
    playersArr: Player[],
    data: PersonalStats,
    titles: AvailableLeaderboard
) {
    const players: Player[] = formatToNums(copyObj(playersArr))
    const teams: [Player[], Player[]] = separateTeams(players)

    for (const team of teams) {
        const statGroups = getTeamStatGroups(team, data)

        if (statGroups.length > 0) {
            const leaderboardName = getTeamLeaderboardName(
                statGroups[0].members.length,
                team
            )
            const leaderboardId = findLeaderboardId(leaderboardName, titles)
            assignTeamRanks(statGroups, data, leaderboardId)

            for (const player of team) {
                const sg = statGroups.find((sg) =>
                    sg.members.some((m) => m.profile_id === player.profileId)
                )
                if (sg) {
                    player.ranking = sg.rank
                    player.teamMarker = sg.teamMarker
                } else {
                    player.ranking = getSolo1v1Rank(player, team, data, titles)
                }
            }
        } else {
            for (const player of team) {
                player.ranking = getSolo1v1Rank(player, team, data, titles)
            }
        }
    }

    for (const team of teams) {
        for (const player of team) {
            if (player.profileId) {
                player.country = findPlayerCountry(player, data)
            }
        }
    }

    return teams
}
