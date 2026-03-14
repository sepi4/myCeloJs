import { AvailableLeaderboard, NormalizedExtraInfo, PersonalStats, StatGroup } from '../types'

const STEAM_PREFIX = '/steam/'

export function refactorData(
    personalStats: PersonalStats,
    availableLeaderboards: AvailableLeaderboard,
    ids: number[]
): NormalizedExtraInfo {
    const players: NormalizedExtraInfo = {}
    for (const id of ids) {
        players[id] = { ranks: [] }
    }

    const statGroupsById: Record<number, StatGroup> = {}
    for (const group of personalStats.statGroups) {
        statGroupsById[group.id] = group
    }

    const leaderboardsById: Record<number, { name: string; isRanked: number }> = {}
    for (const lb of availableLeaderboards.leaderboards) {
        leaderboardsById[lb.id] = { name: lb.name, isRanked: lb.isranked }
    }

    for (const stat of personalStats.leaderboardStats) {
        const group = statGroupsById[stat.statgroup_id]
        const leaderboard = leaderboardsById[stat.leaderboard_id]

        if (!leaderboard) {
            continue
        }

        for (const member of group.members) {
            const player = players[member.profile_id]
            if (!player) {
                continue
            }

            const isDuplicate = player.ranks.some(
                (r) =>
                    r.statgroup_id === stat.statgroup_id && r.leaderboard_id === stat.leaderboard_id
            )
            if (isDuplicate) {
                continue
            }

            player.ranks.push({
                members: group.members,
                name: leaderboard.name,
                isModeRanked: leaderboard.isRanked,
                ...stat,
            })
            break
        }
    }

    for (const id of Object.keys(players)) {
        if (players[id].steamId) {
            break
        }

        for (const rank of players[id].ranks) {
            if (rank.members?.length === 1) {
                players[id].steamId = rank.members[0].name.substring(STEAM_PREFIX.length)
                break
            }
        }
    }

    return players
}
