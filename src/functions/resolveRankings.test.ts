import {
    AvailableLeaderboard,
    LeaderboardStat,
    Member,
    PersonalStats,
    Player,
    StatGroup,
} from '../types'
import { resolveRankings } from './resolveRankings'
import _coh2Leaderboards from './unit-tests-data/coh2-get-available-leaderboards.json'
import _coh3Leaderboards from './unit-tests-data/coh3-get-available-leaderboards.json'

const coh2Leaderboards = _coh2Leaderboards as unknown as AvailableLeaderboard
const coh3Leaderboards = _coh3Leaderboards as unknown as AvailableLeaderboard

// --- Helper factories ---

function makePlayer(overrides: Partial<Player> = {}): Player {
    return {
        name: 'Player',
        faction: 'german',
        teamSlot: 0,
        profileId: 1001,
        time: '0',
        ...overrides,
    }
}

function makeMember(overrides: Partial<Member> = {}): Member {
    return {
        alias: 'Alias',
        country: 'de',
        leaderboardregion_id: 0,
        level: 1,
        name: 'Name',
        personal_statgroup_id: 1,
        profile_id: 1001,
        xp: 0,
        ...overrides,
    }
}

function makeStatGroup(overrides: Partial<StatGroup> = {}): StatGroup {
    return {
        id: 100,
        name: '',
        type: 1,
        members: [makeMember()],
        ...overrides,
    }
}

function makeLbStat(overrides: Partial<LeaderboardStat> = {}): LeaderboardStat {
    return {
        disputes: 0,
        drops: 0,
        lastmatchdate: 0,
        leaderboard_id: 4,
        losses: 0,
        rank: 100,
        ranklevel: 1,
        ranktotal: 1000,
        regionrank: 0,
        regionranktotal: 0,
        statgroup_id: 100,
        streak: 0,
        wins: 0,
        ...overrides,
    }
}

function makeStats(statGroups: StatGroup[], leaderboardStats: LeaderboardStat[]): PersonalStats {
    return {
        result: { code: 0, message: 'SUCCESS' },
        statGroups,
        leaderboardStats,
    }
}

// --- Tests ---

describe('resolveRankings', () => {
    test('COH2 1v1 — solo player gets ranking and country', () => {
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'german',
                teamSlot: 0,
                profileId: 1001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'soviet',
                teamSlot: 1,
                profileId: 1002,
            }),
        ]

        const sg1 = makeStatGroup({
            id: 100,
            type: 1,
            members: [makeMember({ profile_id: 1001, country: 'de' })],
        })
        const sg2 = makeStatGroup({
            id: 101,
            type: 1,
            members: [makeMember({ profile_id: 1002, country: 'ru' })],
        })

        const stats = makeStats(
            [sg1, sg2],
            [
                makeLbStat({ leaderboard_id: 4, statgroup_id: 100, rank: 50 }), // 1v1German
                makeLbStat({ leaderboard_id: 5, statgroup_id: 101, rank: 75 }), // 1v1Soviet
            ]
        )

        const [team0, team1] = resolveRankings(players, stats, coh2Leaderboards)

        expect(team0[0].ranking).toBe(50)
        expect(team0[0].country).toBe('de')
        expect(team0[0].teamMarker).toBeUndefined()

        expect(team1[0].ranking).toBe(75)
        expect(team1[0].country).toBe('ru')
        expect(team1[0].teamMarker).toBeUndefined()
    })

    test('COH2 2v2 team — players get team ranking and markers', () => {
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'aef',
                teamSlot: 0,
                profileId: 2001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'aef',
                teamSlot: 0,
                profileId: 2002,
            }),
        ]

        const teamSg = makeStatGroup({
            id: 200,
            type: 2,
            members: [
                makeMember({ profile_id: 2001, country: 'us' }),
                makeMember({ profile_id: 2002, country: 'ca' }),
            ],
        })

        const stats = makeStats(
            [teamSg],
            [
                makeLbStat({ leaderboard_id: 21, statgroup_id: 200, rank: 30 }), // TeamOf2Allies
            ]
        )

        const [team0] = resolveRankings(players, stats, coh2Leaderboards)

        expect(team0[0].ranking).toBe(30)
        expect(team0[0].teamMarker).toBe(' ¹')
        expect(team0[1].ranking).toBe(30)
        expect(team0[1].teamMarker).toBe(' ¹')
    })

    test('COH2 3v3 — player not in team stat group falls back to solo rank', () => {
        // 3 axis players on team 0; P1+P2 share a type-2 stat group, P3 does not
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'german',
                teamSlot: 0,
                profileId: 3001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'german',
                teamSlot: 0,
                profileId: 3002,
            }),
            makePlayer({
                name: 'P3',
                faction: 'german',
                teamSlot: 0,
                profileId: 3003,
            }),
        ]

        // Type-2 stat group containing P1 and P2 (both on team)
        const teamSg = makeStatGroup({
            id: 300,
            type: 2,
            members: [
                makeMember({ profile_id: 3001, country: 'de' }),
                makeMember({ profile_id: 3002, country: 'de' }),
            ],
        })

        // P3's solo stat group for fallback
        const soloSg = makeStatGroup({
            id: 301,
            type: 1,
            members: [makeMember({ profile_id: 3003, country: 'at' })],
        })

        const stats = makeStats(
            [teamSg, soloSg],
            [
                makeLbStat({ leaderboard_id: 20, statgroup_id: 300, rank: 10 }), // TeamOf2Axis
                makeLbStat({
                    leaderboard_id: 12,
                    statgroup_id: 301,
                    rank: 200,
                }), // 3v3German
            ]
        )

        const [team0] = resolveRankings(players, stats, coh2Leaderboards)

        // P1 and P2 get team rank + marker
        expect(team0[0].ranking).toBe(10)
        expect(team0[0].teamMarker).toBe(' ¹')
        expect(team0[1].ranking).toBe(10)
        expect(team0[1].teamMarker).toBe(' ¹')

        // P3 falls back to solo 3v3German rank, no marker
        expect(team0[2].ranking).toBe(200)
        expect(team0[2].teamMarker).toBeUndefined()
    })

    test('COH3 1v1 — unranked fallback', () => {
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'americans',
                teamSlot: 0,
                profileId: 4001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'germans',
                teamSlot: 1,
                profileId: 4002,
            }),
        ]

        const sg1 = makeStatGroup({
            id: 400,
            type: 1,
            members: [makeMember({ profile_id: 4001, country: 'us' })],
        })
        const sg2 = makeStatGroup({
            id: 401,
            type: 1,
            members: [makeMember({ profile_id: 4002, country: 'de' })],
        })

        const stats = makeStats(
            [sg1, sg2],
            [
                // No ranked entry for 1v1American (2130256), only unranked (2130255)
                makeLbStat({
                    leaderboard_id: 2130255,
                    statgroup_id: 400,
                    rank: 500,
                }),
            ]
        )

        const [team0] = resolveRankings(players, stats, coh3Leaderboards)

        expect(team0[0].ranking).toBe(500)
    })

    test('No matching stats — ranking stays undefined', () => {
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'german',
                teamSlot: 0,
                profileId: 5001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'soviet',
                teamSlot: 1,
                profileId: 5002,
            }),
        ]

        // Empty stats — no stat groups match these profileIds
        const stats = makeStats([], [])

        const [team0, team1] = resolveRankings(players, stats, coh2Leaderboards)

        expect(team0[0].ranking).toBeUndefined()
        expect(team0[0].country).toBeUndefined()
        expect(team1[0].ranking).toBeUndefined()
        expect(team1[0].country).toBeUndefined()
    })

    test('COH2 2v2 — team stat group exists but unranked, falls back to solo rank and keeps team marker', () => {
        // P1 and P2 share a type-2 stat group but have no team leaderboard entry.
        // They should fall back to their individual 2v2German ranks and still share a teamMarker.
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'german',
                teamSlot: 0,
                profileId: 7001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'german',
                teamSlot: 0,
                profileId: 7002,
            }),
        ]

        const teamSg = makeStatGroup({
            id: 700,
            type: 2,
            members: [
                makeMember({ profile_id: 7001, country: 'de' }),
                makeMember({ profile_id: 7002, country: 'pl' }),
            ],
        })

        const soloSg1 = makeStatGroup({
            id: 701,
            type: 1,
            members: [makeMember({ profile_id: 7001, country: 'de' })],
        })
        const soloSg2 = makeStatGroup({
            id: 702,
            type: 1,
            members: [makeMember({ profile_id: 7002, country: 'pl' })],
        })

        const stats = makeStats(
            [teamSg, soloSg1, soloSg2],
            [
                // No team ranking for TeamOf2Axis — teamSg 700 has no leaderboard entry
                makeLbStat({ leaderboard_id: 8, statgroup_id: 701, rank: 55 }), // 2v2German P1
                makeLbStat({ leaderboard_id: 8, statgroup_id: 702, rank: 88 }), // 2v2German P2
            ]
        )

        const [team0] = resolveRankings(players, stats, coh2Leaderboards)

        // Both fall back to individual 2v2German rankings
        expect(team0[0].ranking).toBe(55)
        expect(team0[1].ranking).toBe(88)

        // But they still share a teamMarker because they are in the same stat group
        expect(team0[0].teamMarker).toBe(' ¹')
        expect(team0[1].teamMarker).toBe(' ¹')
    })

    test('Mixed factions in team — no team leaderboard, falls back to individual', () => {
        const players: Player[] = [
            makePlayer({
                name: 'P1',
                faction: 'german',
                teamSlot: 0,
                profileId: 6001,
            }),
            makePlayer({
                name: 'P2',
                faction: 'aef',
                teamSlot: 0,
                profileId: 6002,
            }),
        ]

        const sg1 = makeStatGroup({
            id: 600,
            type: 1,
            members: [makeMember({ profile_id: 6001, country: 'de' })],
        })
        const sg2 = makeStatGroup({
            id: 601,
            type: 1,
            members: [makeMember({ profile_id: 6002, country: 'us' })],
        })

        const stats = makeStats(
            [sg1, sg2],
            [
                makeLbStat({ leaderboard_id: 8, statgroup_id: 600, rank: 150 }), // 2v2German
                makeLbStat({
                    leaderboard_id: 11,
                    statgroup_id: 601,
                    rank: 250,
                }), // 2v2AEF
            ]
        )

        const [team0] = resolveRankings(players, stats, coh2Leaderboards)

        expect(team0[0].ranking).toBe(150)
        expect(team0[0].teamMarker).toBeUndefined()
        expect(team0[1].ranking).toBe(250)
        expect(team0[1].teamMarker).toBeUndefined()
    })
})
