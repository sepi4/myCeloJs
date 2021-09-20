/**
 * From server, raw
 */
export interface Member {
    alias: string;
    country: string;
    leaderboardregion_id: number;
    level: number;
    name: string;
    personal_statgroup_id: number;
    profile_id: number;
    xp: number;
}

export interface RankForTableView {
    disputes: number;
    drops: number;
    isModeRanked: number;
    lastmatchdate: number;
    leaderboard_id: number;
    losses: number;
    members: Member[];
    name: string;
    rank: number;
    ranklevel: number;
    ranktotal: number;
    regionrank: number;
    regionranktotal: number;
    statgroup_id: number;
    streak: number;
    wins: number;
}

export interface CountryFlagsLocation {
    [key: string]: string;
}

export interface Settings {
    logLocation: string;
    language: string;
    appLocation: string;
    rankingsHtml: boolean;
    rankingsFile: string;
    rankingsHorizontal: boolean;
    siteLink: string;
    steamId: string;
    profileId: string;
}

interface StatGroup {
    id: number;
    members: Member;
    name: string;
    type: number;
}

export interface LeaderboardStat {
    disputes: number;
    drops: number;
    lastmatchdate: number;
    leaderboard_id: number;
    losses: number;
    rank: number;
    ranklevel: number;
    ranktotal: number;
    regionrank: number;
    regionranktotal: number;
    statgroup_id: number;
    streak: number;
    wins: number;
}

export interface PersonalStats {
    leaderboardStats: LeaderboardStat[];
    result: { code: number; message: string };
    statGroups: StatGroup[];
}

interface Leaderboard {
    id: number;
    isranked: number;
    leaderboardmap: any[];
    name: string;
}

export interface MatchType {
    id: number;
    localizedName: string;
    locstringid: number;
    name: string;
}

interface Race {
    faction_id: number;
    id: number;
    localizedName: string;
    locstringid: number;
    name: string;
}

export interface AvailableLeaderboard {
    factions: any[];
    leaderboardRegions: any[];
    result: any[];
    leaderboards: Leaderboard[];
    matchTypes: MatchType[];
    races: Race[];
}

export interface MatchHistoryReportResult {
    matchhistory_id: number;
    profile_id: number;
    resulttype: number;
    teamid: number;
    race_id: number;
    xpgained: number;
    counters: string;
    matchstartdate: number;
}

export interface MatchHistoryStat {
    id: number;
    creator_profile_id: number;
    mapname: string;
    maxplayers: number;
    matchtype_id: number;
    options: string;
    slotinfo: string;
    description: string;
    startgametime: number;
    completiontime: number;
    observertotal: number;
    matchhistoryreportresults: MatchHistoryReportResult[];
    matchhistoryitems: any[];
    matchurls: any[];
}

/**
 * Profile as it return from Relic server on RecentMatchHistory call
 */
export interface Profile {
    profile_id: number;
    name: string;
    alias: string;
    personal_statgroup_id: number;
    xp: number;
    level: number;
    leaderboardregion_id: number;
    country: string;
}

/**
 * relic match history api return format
 */
export interface RecentMatchHistory {
    result: {
        code: number;
        message: string;
    };
    matchHistoryStats: MatchHistoryStat[];
    profiles: Profile[];
}

export interface Rank {
    disputes: number;
    drops: number;
    lastmatchdate: number;
    leaderboard_id: number;
    losses: number;
    rank: number;
    ranklevel: number;
    ranktotal: number;
    regionrank: number;
    regionranktotal: number;
    statgroup_id: number;
    streak: number;
    wins: number;

    name: string;

    isModeRanked?: 1;
    members?: any[];
}

export interface InitialStore {
    settingsView: boolean;
    settings: Settings | null;
    logCheckInterval: number;
    autoLogChecking: boolean;
    alert: boolean;
    updateCheckDone: boolean;
    appLocation: string;
    players: any; // TODO
    fromFile: any; // TODO
    extraInfo: any; // TODO
    navButtons: {
        all: boolean;
        table: boolean;
        total: boolean;
    };
    openInfos: [boolean[], boolean[]];
    countryFlags: CountryFlagsLocation;
    sorter: {
        fun: (a: any, b: any) => number; // TODO
        name: string;
        reversed: boolean;
    };
    playerCard: {
        player: any; // TODO
        extraInfo: any; // TODO
    };
    view: string;
    foundPlayers: any[]; // TODO
}
