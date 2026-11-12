import flagAfrikaKorps from '../assets/img/afrika_korps.png'
import flagAmericans from '../assets/img/americans.png'
import flagBritishAfrica from '../assets/img/british_africa.png'
import flagGermans from '../assets/img/germans.png'
import flagOkw from '../assets/img/okw.png'
import flagSov from '../assets/img/sov.png'
import flagUk from '../assets/img/uk.png'
import flagUsa from '../assets/img/usa.png'
import flagWer from '../assets/img/wer.png'

export type Game = 'coh2' | 'coh3'

export const GAMES: readonly Game[] = ['coh2', 'coh3']

interface Faction {
    /** Short code used in this app, for example in the rankings file. */
    code: string
    /** Faction name in the log file. */
    logName: string
    /** Faction name in leaderboard names such as `1v1Soviet`. */
    leaderboardName: string
    flag: string
}

interface GameConfig {
    apiBase: string
    /** Value of the `title` parameter in API requests. */
    apiTitle: string
    /** Found on the first line of the game's log file. */
    logHeader: RegExp
    logLocationKey: 'logLocationCoh2' | 'logLocationCoh3'
    profileIdKey: 'profileIdCoh2' | 'profileIdCoh3'
    hasElo: boolean
    /** In the order of the rank table. */
    factions: Faction[]
    /** API race_id → short faction code. */
    factionCodesByRaceId: Record<number, string>
}

export const GAME_CONFIG: Record<Game, GameConfig> = {
    coh2: {
        apiBase: 'https://coh2-api.reliclink.com/community/leaderboard',
        apiTitle: 'coh2',
        logHeader: /RELICCOH2/,
        logLocationKey: 'logLocationCoh2',
        profileIdKey: 'profileIdCoh2',
        hasElo: false,
        factions: [
            { code: 'sov', logName: 'soviet', leaderboardName: 'Soviet', flag: flagSov },
            { code: 'wer', logName: 'german', leaderboardName: 'German', flag: flagWer },
            { code: 'usa', logName: 'aef', leaderboardName: 'AEF', flag: flagUsa },
            { code: 'okw', logName: 'west_german', leaderboardName: 'WestGerman', flag: flagOkw },
            { code: 'uk', logName: 'british', leaderboardName: 'British', flag: flagUk },
        ],
        factionCodesByRaceId: {
            0: 'wer',
            1: 'sov',
            2: 'okw',
            3: 'usa',
            4: 'uk',
        },
    },
    coh3: {
        apiBase: 'https://coh3-api.reliclink.com/community/leaderboard',
        apiTitle: 'coh3',
        logHeader: /RelicCoH3/,
        logLocationKey: 'logLocationCoh3',
        profileIdKey: 'profileIdCoh3',
        hasElo: true,
        factions: [
            { code: 'dak', logName: 'afrika_korps', leaderboardName: 'DAK', flag: flagAfrikaKorps },
            { code: 'wer', logName: 'germans', leaderboardName: 'German', flag: flagGermans },
            { code: 'usa', logName: 'americans', leaderboardName: 'American', flag: flagAmericans },
            {
                code: 'uk',
                logName: 'british_africa',
                leaderboardName: 'British',
                flag: flagBritishAfrica,
            },
        ],
        // race_id values from coh3-api.reliclink.com/community/leaderboard/GetAvailableLeaderboards?title=coh3
        factionCodesByRaceId: {
            129494: 'usa',
            137123: 'wer',
            197345: 'uk',
            198437: 'dak',
            203852: 'uk',
        },
    },
}

export function otherGame(game: Game): Game {
    return game === 'coh2' ? 'coh3' : 'coh2'
}

export function getFactionCode(game: Game, logFaction: string): string {
    return GAME_CONFIG[game].factions.find((f) => f.logName === logFaction)?.code ?? ''
}

export function getFactionCodeByLeaderboardName(
    game: Game,
    leaderboardName: string
): string | undefined {
    return GAME_CONFIG[game].factions.find((f) => f.leaderboardName === leaderboardName)?.code
}

/** Log faction names differ between the games, so the game is not needed. */
export function getFactionLeaderboardName(logFaction: string): string {
    const factions = GAMES.flatMap((game) => GAME_CONFIG[game].factions)
    return factions.find((f) => f.logName === logFaction)?.leaderboardName ?? ''
}

export function getFactionCodeByRaceId(game: Game, raceId: number): string {
    return GAME_CONFIG[game].factionCodesByRaceId[raceId] ?? ''
}

export function getFactionFlag(game: Game, factionCode: string): string | undefined {
    return GAME_CONFIG[game].factions.find((f) => f.code === factionCode)?.flag
}
