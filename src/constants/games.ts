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

interface GameConfig {
    apiBase: string
    /** Value of the `title` parameter in API requests. */
    apiTitle: string
    /** Found on the first line of the game's log file. */
    logHeader: RegExp
    logLocationKey: 'logLocationCoh2' | 'logLocationCoh3'
    profileIdKey: 'profileIdCoh2' | 'profileIdCoh3'
    hasElo: boolean
    /** Faction name in the log file → short faction code. */
    factionCodes: Record<string, string>
    /** API race_id → short faction code. */
    factionCodesByRaceId: Record<number, string>
    /** Short faction code → flag image. */
    factionFlags: Record<string, string>
}

export const GAME_CONFIG: Record<Game, GameConfig> = {
    coh2: {
        apiBase: 'https://coh2-api.reliclink.com/community/leaderboard',
        apiTitle: 'coh2',
        logHeader: /RELICCOH2/,
        logLocationKey: 'logLocationCoh2',
        profileIdKey: 'profileIdCoh2',
        hasElo: false,
        factionCodes: {
            british: 'uk',
            aef: 'usa',
            soviet: 'sov',
            west_german: 'okw',
            german: 'wer',
        },
        factionCodesByRaceId: {
            0: 'wer',
            1: 'sov',
            2: 'okw',
            3: 'usa',
            4: 'uk',
        },
        factionFlags: {
            okw: flagOkw,
            sov: flagSov,
            uk: flagUk,
            usa: flagUsa,
            wer: flagWer,
        },
    },
    coh3: {
        apiBase: 'https://coh3-api.reliclink.com/community/leaderboard',
        apiTitle: 'coh3',
        logHeader: /RelicCoH3/,
        logLocationKey: 'logLocationCoh3',
        profileIdKey: 'profileIdCoh3',
        hasElo: true,
        factionCodes: {
            americans: 'usa',
            afrika_korps: 'dak',
            british_africa: 'uk',
            germans: 'wer',
        },
        // race_id values from coh3-api.reliclink.com/community/leaderboard/GetAvailableLeaderboards?title=coh3
        factionCodesByRaceId: {
            129494: 'usa',
            137123: 'wer',
            197345: 'uk',
            198437: 'dak',
            203852: 'uk',
        },
        factionFlags: {
            dak: flagAfrikaKorps,
            usa: flagAmericans,
            uk: flagBritishAfrica,
            wer: flagGermans,
        },
    },
}

export function otherGame(game: Game): Game {
    return game === 'coh2' ? 'coh3' : 'coh2'
}

export function getFactionCode(game: Game, logFaction: string): string {
    return GAME_CONFIG[game].factionCodes[logFaction] ?? ''
}

export function getFactionCodeByRaceId(game: Game, raceId: number): string {
    return GAME_CONFIG[game].factionCodesByRaceId[raceId] ?? ''
}

export function getFactionFlag(game: Game, factionCode: string): string | undefined {
    return GAME_CONFIG[game].factionFlags[factionCode]
}
