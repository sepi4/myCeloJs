type Team = {
    country?: string
    faction: string
    name: string
    ranking: string
}

export type RankingsJson = {
    teams: {
        team1: Team[]
        team2: Team[]
    }
    horizontal: boolean
}

export type Player = {
    country?: string
    faction: string
    name: string
    profileId?: number
    ranking?: number
    teamMarker?: string
    teamSlot: number
    time: string
}

export type FactionName = 'okw' | 'sov' | 'uk' | 'usa' | 'wer'

export type Member = {
    alias: string
    country: string
    leaderboardregion_id: number
    level: number
    name: string
    personal_statgroup_id: number
    profile_id: number
    xp: number

    // TODO remove this maybe
    totalGames?: number
    lastGameTime?: number
    extraInfo?: ExtraInfo
}

export type CountryFlagsLocation = {
    [key: string]: string
}

export type SettingsType = {
    logLocationCoh2: string
    logLocationCoh3: string
    language: string
    appLocation: string
    rankingsHtml: boolean
    rankingsFile: string
    rankingsHorizontal: boolean
    steamId: string
    profileIdCoh2: number
    profileIdCoh3: number
    ignoreUntil?: string
}

export type StatGroup = {
    id: number
    members: Member[]
    name: string
    type: number
    rank?: number
    teamMarker?: string
}

export type LeaderboardStat = {
    disputes: number
    drops: number
    lastmatchdate: number
    leaderboard_id: number
    losses: number
    rank: number
    ranklevel: number
    ranktotal: number
    regionrank: number
    regionranktotal: number
    statgroup_id: number
    streak: number
    wins: number
}

export type PersonalStats = {
    leaderboardStats: LeaderboardStat[]
    result: { code: number; message: string }
    statGroups: StatGroup[]
}

export type Leaderboard = {
    id: number
    isranked: number
    leaderboardmap: {
        matchtype_id: number
        race_id: number
        statgroup_type: number
    }
    name: string
}

export type MatchType = {
    id: number
    localizedName: string
    locstringid: number
    name: string
}

export type MatchObject = {
    startGameTime: Date
    endGameTime: Date
    mapName: string
    players: MatchHistoryReportResult[]
    matchType: MatchType | undefined
    description: string
    all: MatchHistoryStat
    result: MatchHistoryReportResult | undefined
    counters: { [key: string]: number } | undefined
}

export type NormalizedProfiles = {
    [key: number]: Profile
}

type Race = {
    faction_id: number
    id: number
    localizedName: string
    locstringid: number
    name: string
}

export type AvailableLeaderboard = {
    factions: {
        id: number
        localizedName: 'Allies' | 'Axis'
        locstringid: number
        name: 'Allies' | 'Axis'
    }[]
    leaderboardRegions: {
        id: number
        locstringid: number
        name: string
    }[]
    result: { code: number; message: string }
    leaderboards: Leaderboard[]
    matchTypes: MatchType[]
    races: Race[]
}

export type MatchHistoryReportResult = {
    matchhistory_id: number
    profile_id: number
    resulttype: number
    teamid: number
    race_id: number
    xpgained: number
    counters: {
        [key: string]: number
    }
    matchstartdate: number
}

export type MatchHistoryStat = {
    completiontime: number
    creator_profile_id: number
    description: string
    id: number
    mapname: string
    matchhistoryitems: {
        durability: number
        durabilitytype: number
        itemdefinition_id: number
        iteminstance_id: number
        itemlocation_id: number
        matchhistory_id: number
        metadata: string
        profile_id: number
    }[]
    matchhistoryreportresults: MatchHistoryReportResult[]
    matchtype_id: number
    matchurls: []
    maxplayers: number
    observertotal: number
    options: string
    slotinfo: string
    startgametime: number
}

export type Profile = {
    profile_id: number
    name: string
    alias: string
    personal_statgroup_id: number
    xp: number
    level: number
    leaderboardregion_id: number
    country: string
}

export type RecentMatchHistory = {
    result: {
        code: number
        message: string
    }
    matchHistoryStats: MatchHistoryStat[]
    profiles: Profile[]
}

export type Rank = {
    disputes: number
    drops: number
    lastmatchdate: number
    leaderboard_id: number
    losses: number
    rank: number
    ranklevel: number
    ranktotal: number
    regionrank: number
    regionranktotal: number
    statgroup_id: number
    streak: number
    wins: number

    name: string

    isModeRanked?: number
    members?: Member[]
}

export type ExtraInfo = {
    ranks: Rank[]
    steamId?: string
}

export type NormalizedExtraInfo = {
    [key: string]: ExtraInfo
}
