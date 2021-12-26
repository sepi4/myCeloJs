type Team = {
    country?: string
    faction: string
    name: string
    ranking: string
}
/**
 * rankings json file format
 */
export interface RankingsJson {
    teams: {
        team1: Team[]
        team2: Team[]
    }
    horizontal: boolean
}

export interface Player {
    country?: string
    faction: string
    name: string
    profileId?: number
    ranking?: number
    teamSlot: number
    time: string
    teamMarker?: string
}

export type FactionName = 'okw' | 'sov' | 'uk' | 'usa' | 'wer'

/**
 * From server, raw
 */
export interface Member {
    alias: string
    country: string
    leaderboardregion_id: number
    level: number
    name: string
    personal_statgroup_id: number
    profile_id: number
    xp: number
}

export interface RankForTableView {
    disputes: number
    drops: number
    isModeRanked: number
    lastmatchdate: number
    leaderboard_id: number
    losses: number
    members: Member[]
    name: string
    rank: number
    ranklevel: number
    ranktotal: number
    regionrank: number
    regionranktotal: number
    statgroup_id: number
    streak: number
    wins: number
}

export interface CountryFlagsLocation {
    [key: string]: string
}

export interface SettingsType {
    logLocation: string
    language: string
    appLocation: string
    rankingsHtml: boolean
    rankingsFile: string
    rankingsHorizontal: boolean
    siteLink: string
    steamId: string
    profileId: string
}

export interface StatGroup {
    id: number
    members: Member[]
    name: string
    type: number
    rank?: number
    teamMarker?: string
}

export interface LeaderboardStat {
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

export interface PersonalStats {
    leaderboardStats: LeaderboardStat[]
    result: { code: number; message: string }
    statGroups: StatGroup[]
}

export interface Leaderboard {
    id: number
    isranked: number
    leaderboardmap: {
        matchtype_id: number
        race_id: number
        statgroup_type: number
    }
    name: string
}

export interface MatchType {
    id: number
    localizedName: string
    locstringid: number
    name: string
}

interface Race {
    faction_id: number
    id: number
    localizedName: string
    locstringid: number
    name: string
}

export interface AvailableLeaderboard {
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

export interface MatchHistoryReportResult {
    matchhistory_id: number
    profile_id: number
    resulttype: number
    teamid: number
    race_id: number
    xpgained: number
    counters: string
    matchstartdate: number
}

export interface MatchHistoryStat {
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

/**
 * Profile as it return from Relic server on RecentMatchHistory call
 */
export interface Profile {
    profile_id: number
    name: string
    alias: string
    personal_statgroup_id: number
    xp: number
    level: number
    leaderboardregion_id: number
    country: string
}

/**
 * relic match history api return format
 */
export interface RecentMatchHistory {
    result: {
        code: number
        message: string
    }
    matchHistoryStats: MatchHistoryStat[]
    profiles: Profile[]
}

export interface Rank {
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

export interface ExtraInfo {
    ranks: Rank[]
    steamId?: string
}
export interface NormalizedExtraInfo {
    [key: string]: ExtraInfo
}

/**
 * Format that come from warnings.log
 */
export interface DataFromFile {
    faction: string
    name: string
    profileId: string
    ranking: string
    slot: string
    teamSlot: string
    time: string

    // faction: "soviet"
    // name: "sepi"
    // profileId: "580525"
    // ranking: "-1"
    // slot: "0"
    // teamSlot: "0"
    // time: "01:32:47.12"
}

export interface Store {
    settingsView: boolean
    settings: SettingsType | null
    logCheckInterval: number
    autoLogChecking: boolean
    alert: boolean
    updateCheckDone: boolean
    appLocation: string
    players: Player[] | null
    fromFile: DataFromFile[] | null
    extraInfo: NormalizedExtraInfo | null
    navButtons: {
        all: boolean
        table: boolean
        total: boolean
    }
    openInfos: boolean[][]
    countryFlags: CountryFlagsLocation
    sorter: {
        name: string
        reversed: boolean
    }
    playerCard: {
        player: Player | null
        extraInfo: NormalizedExtraInfo | null
    }
    view: string
    foundPlayers: Player[]
}
