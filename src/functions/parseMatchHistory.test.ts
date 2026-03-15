import {
    AvailableLeaderboard,
    MatchHistoryReportResult,
    MatchHistoryStat,
    MatchType,
    Player,
    Profile,
    RecentMatchHistory,
} from '../types'
import { parseHistoryData } from './parseMatchHistory'

// --- Helpers ---

const makePlayer = (profileId: number): Player =>
    ({
        profileId,
        faction: 'soviet',
        name: 'player',
        teamSlot: 0,
        time: '',
    }) as Player

const makeProfile = (profileId: number): Profile =>
    ({
        profile_id: profileId,
        name: `player_${profileId}`,
        alias: `alias_${profileId}`,
    }) as Profile

const makeReportResult = (
    profileId: number,
    counters: Record<string, number> = { dmgdone: 100 }
): MatchHistoryReportResult =>
    ({
        profile_id: profileId,
        resulttype: 1,
        race_id: 0,
        counters: JSON.stringify(counters) as unknown as Record<string, number>,
    }) as MatchHistoryReportResult

const makeMatchStat = (overrides: Partial<MatchHistoryStat> = {}): MatchHistoryStat =>
    ({
        completiontime: 1000,
        startgametime: 900,
        mapname: 'testmap',
        description: 'test match',
        matchtype_id: 1,
        matchhistoryreportresults: [makeReportResult(100)],
        matchhistoryitems: [],
        matchurls: [],
        ...overrides,
    }) as MatchHistoryStat

const makeMatchType = (id: number, name: string): MatchType =>
    ({
        id,
        name,
        localizedName: name,
    }) as MatchType

const makeResult = (
    matches: MatchHistoryStat[],
    profiles: Profile[],
    matchTypes: MatchType[] = []
): [RecentMatchHistory, AvailableLeaderboard] => [
    {
        matchHistoryStats: matches,
        profiles,
        result: { code: 0, message: '' },
    },
    { matchTypes } as AvailableLeaderboard,
]

// --- Tests ---

describe('parseHistoryData', () => {
    it('sorts matches by completion time descending', () => {
        const older = makeMatchStat({ completiontime: 1000, startgametime: 900 })
        const newer = makeMatchStat({ completiontime: 2000, startgametime: 1900 })
        const result = makeResult([older, newer], [makeProfile(100)])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.matchHistoryStats[0].endGameTime.getTime()).toBeGreaterThan(
            parsed.matchHistoryStats[1].endGameTime.getTime()
        )
    })

    it('converts unix timestamps to Date objects', () => {
        const match = makeMatchStat({ startgametime: 1000, completiontime: 2000 })
        const result = makeResult([match], [makeProfile(100)])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.matchHistoryStats[0].startGameTime).toEqual(new Date(1000 * 1000))
        expect(parsed.matchHistoryStats[0].endGameTime).toEqual(new Date(2000 * 1000))
    })

    it('parses counters from JSON string', () => {
        const match = makeMatchStat({
            matchhistoryreportresults: [makeReportResult(100, { dmgdone: 500 })],
        })
        const result = makeResult([match], [makeProfile(100)])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.matchHistoryStats[0].players[0].counters).toEqual({ dmgdone: 500 })
    })

    it('finds the matching match type', () => {
        const match = makeMatchStat({ matchtype_id: 5 })
        const matchType = makeMatchType(5, '1v1')
        const result = makeResult([match], [makeProfile(100)], [matchType])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.matchHistoryStats[0].matchType?.name).toBe('1v1')
    })

    it('finds the current player result by profileId', () => {
        const match = makeMatchStat({
            matchhistoryreportresults: [makeReportResult(100), makeReportResult(200)],
        })
        const result = makeResult([match], [makeProfile(100), makeProfile(200)])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.matchHistoryStats[0].result?.profile_id).toBe(100)
    })

    it('skips matches with no players', () => {
        const emptyMatch = makeMatchStat({ matchhistoryreportresults: [] })
        const normalMatch = makeMatchStat()
        const result = makeResult([emptyMatch, normalMatch], [makeProfile(100)])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.matchHistoryStats).toHaveLength(1)
    })

    it('normalizes profiles array into id-keyed object', () => {
        const result = makeResult([makeMatchStat()], [makeProfile(100), makeProfile(200)])

        const parsed = parseHistoryData(result, makePlayer(100))

        expect(parsed.profiles[100].name).toBe('player_100')
        expect(parsed.profiles[200].name).toBe('player_200')
    })
})
