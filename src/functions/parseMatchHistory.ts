import {
    AvailableLeaderboard,
    MatchHistoryStat,
    MatchObject,
    MatchType,
    NormalizedProfiles,
    Player,
    RecentMatchHistory,
} from '../types'

type HistoryResult = [RecentMatchHistory, AvailableLeaderboard]

type ParsedHistory = {
    matchHistoryStats: MatchObject[]
    profiles: NormalizedProfiles
}

function toMatchObject(
    match: MatchHistoryStat,
    matchTypes: MatchType[],
    player: Player
): MatchObject | null {
    const players = match.matchhistoryreportresults.map((report) => ({
        ...report,
        counters: JSON.parse(report.counters as unknown as string),
    }))

    if (players.length === 0) {
        return null
    }

    // TODO === fix string profileId
    const playerResult = players.find((r) => r.profile_id == player.profileId)

    return {
        startGameTime: new Date(match.startgametime * 1000),
        endGameTime: new Date(match.completiontime * 1000),
        mapName: match.mapname,
        players,
        matchType: matchTypes.find((t) => t.id === match.matchtype_id),
        description: match.description,
        all: match,
        result: playerResult,
        counters: playerResult?.counters,
    }
}

function normalizeProfiles(profiles: RecentMatchHistory['profiles']): NormalizedProfiles {
    const normalized: NormalizedProfiles = {}
    for (const profile of profiles) {
        normalized[profile.profile_id] = profile
    }
    return normalized
}

export function parseHistoryData(result: HistoryResult, player: Player): ParsedHistory {
    const { matchHistoryStats, profiles } = result[0]
    const { matchTypes } = result[1]

    const sortedMatches = matchHistoryStats.sort((a, b) => b.completiontime - a.completiontime)

    const matchObjects: MatchObject[] = []
    for (const match of sortedMatches) {
        const matchObject = toMatchObject(match, matchTypes, player)
        if (matchObject) {
            matchObjects.push(matchObject)
        }
    }

    return {
        matchHistoryStats: matchObjects,
        profiles: normalizeProfiles(profiles),
    }
}
