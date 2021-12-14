// declare module '*.module.css' {
//     const classes: { [key: string]: string };
//     export default classes;
// }

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

/**
 * Player object after reading warnings.log file.
 * Used readlog
 */
export interface Player {
    name: string
    teamSlot: string
    faction: string
    time: string
    profileId?: string

    id?: string
    ranking?: string
}

/**
 * Player object passed in getExtraInfo
 * Used getExtraInfo
 */
export interface PlayerFromFile {
    country?: string
    faction: string
    name: string
    profileId?: number
    ranking?: number | string
    teamSlot: number
    time: string
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

export interface Settings {
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
    rank?: string
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

export interface LeaderboardStatWithRankToTeam
    extends Omit<LeaderboardStat, 'rank'> {
    rank: number | string
}

export interface PersonalStats {
    leaderboardStats: LeaderboardStat[]
    result: { code: number; message: string }
    statGroups: StatGroup[]
}

export interface Leaderboard {
    id: number
    isranked: number
    leaderboardmap: any[]
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
    factions: any[]
    leaderboardRegions: any[]
    result: any[]
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
    id: number
    creator_profile_id: number
    mapname: string
    maxplayers: number
    matchtype_id: number
    options: string
    slotinfo: string
    description: string
    startgametime: number
    completiontime: number
    observertotal: number
    matchhistoryreportresults: MatchHistoryReportResult[]
    matchhistoryitems: any[]
    matchurls: any[]
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

    isModeRanked?: 1
    members?: any[]
}

/**
 * Format that come from warnings.log
 */
export interface DataFromFile {
    // TODO check if used
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
    settings: Settings | null
    logCheckInterval: number
    autoLogChecking: boolean
    alert: boolean
    updateCheckDone: boolean
    appLocation: string
    players: any // TODO
    fromFile: DataFromFile[] | null
    extraInfo: any // TODO
    navButtons: {
        all: boolean
        table: boolean
        total: boolean
    }
    openInfos: [boolean[], boolean[]]
    countryFlags: CountryFlagsLocation
    sorter: {
        name: string
        reversed: boolean
    }
    playerCard: {
        player: any // TODO
        extraInfo: any // TODO
    }
    view: string
    foundPlayers: any[] // TODO
}
