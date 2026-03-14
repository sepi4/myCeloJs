import { AvailableLeaderboard, LeaderboardStat, Member, PersonalStats, StatGroup } from '../types'
import { refactorData } from './refactorData'

// --- Helpers ---

const makeMember = (profileId: number, name = `/steam/${profileId}`): Member =>
    ({
        profile_id: profileId,
        name,
    }) as Member

const makeStatGroup = (id: number, members: Member[]): StatGroup =>
    ({
        id,
        members,
    }) as StatGroup

const makeLeaderboardStat = (
    leaderboardId: number,
    statgroupId: number,
    overrides: Partial<LeaderboardStat> = {}
): LeaderboardStat =>
    ({
        leaderboard_id: leaderboardId,
        statgroup_id: statgroupId,
        rank: 1,
        wins: 5,
        losses: 3,
        streak: 2,
        ...overrides,
    }) as LeaderboardStat

const makePersonalStats = (
    statGroups: StatGroup[],
    leaderboardStats: LeaderboardStat[]
): PersonalStats => ({
    statGroups,
    leaderboardStats,
    result: { code: 0, message: '' },
})

const makeCohTitles = (
    leaderboards: { id: number; name: string; isranked?: number }[]
): AvailableLeaderboard =>
    ({
        leaderboards: leaderboards.map((l) => ({
            id: l.id,
            name: l.name,
            isranked: l.isranked ?? 1,
            leaderboardmap: {},
        })),
    }) as AvailableLeaderboard

// --- Tests ---

describe('refactorData', () => {
    it('initializes empty ranks for each player id', () => {
        const stats = makePersonalStats([], [])
        const titles = makeCohTitles([])

        const result = refactorData(stats, titles, [100, 200])

        expect(result[100]).toEqual({ ranks: [] })
        expect(result[200]).toEqual({ ranks: [] })
    })

    it('assigns rank to the correct player', () => {
        const member = makeMember(100)
        const stats = makePersonalStats([makeStatGroup(1, [member])], [makeLeaderboardStat(10, 1)])
        const titles = makeCohTitles([{ id: 10, name: '1v1 Soviet' }])

        const result = refactorData(stats, titles, [100])

        expect(result[100].ranks).toHaveLength(1)
        expect(result[100].ranks[0].name).toBe('1v1 Soviet')
    })

    it('sets isModeRanked from leaderboard definition', () => {
        const member = makeMember(100)
        const stats = makePersonalStats([makeStatGroup(1, [member])], [makeLeaderboardStat(10, 1)])
        const titles = makeCohTitles([{ id: 10, name: '1v1', isranked: 0 }])

        const result = refactorData(stats, titles, [100])

        expect(result[100].ranks[0].isModeRanked).toBe(0)
    })

    it('skips leaderboard stats with unknown leaderboard id', () => {
        const member = makeMember(100)
        const stats = makePersonalStats([makeStatGroup(1, [member])], [makeLeaderboardStat(999, 1)])
        const titles = makeCohTitles([{ id: 10, name: '1v1' }])

        const result = refactorData(stats, titles, [100])

        expect(result[100].ranks).toHaveLength(0)
    })

    it('skips players not in the ids list', () => {
        const memberNotInIdsList = makeMember(999)
        const stats = makePersonalStats(
            [makeStatGroup(1, [memberNotInIdsList])],
            [makeLeaderboardStat(10, 1)]
        )
        const titles = makeCohTitles([{ id: 10, name: '1v1' }])

        const result = refactorData(stats, titles, [100])

        expect(result[100].ranks).toHaveLength(0)
        expect(result[999]).toBeUndefined()
    })

    it('deduplicates ranks with same statgroup and leaderboard', () => {
        const member = makeMember(100)
        const group = makeStatGroup(1, [member])
        const stats = makePersonalStats(
            [group],
            [makeLeaderboardStat(10, 1), makeLeaderboardStat(10, 1)]
        )
        const titles = makeCohTitles([{ id: 10, name: '1v1' }])

        const result = refactorData(stats, titles, [100])

        expect(result[100].ranks).toHaveLength(1)
    })

    it('extracts steamId from single-member rank', () => {
        const soloMember = makeMember(100, '/steam/76561198000000001')
        const stats = makePersonalStats(
            [makeStatGroup(1, [soloMember])],
            [makeLeaderboardStat(10, 1)]
        )
        const titles = makeCohTitles([{ id: 10, name: '1v1' }])

        const result = refactorData(stats, titles, [100])

        expect(result[100].steamId).toBe('76561198000000001')
    })

    it('does not extract steamId from multi-member rank', () => {
        const teamMember1 = makeMember(100)
        const teamMember2 = makeMember(200)
        const stats = makePersonalStats(
            [makeStatGroup(1, [teamMember1, teamMember2])],
            [makeLeaderboardStat(10, 1)]
        )
        const titles = makeCohTitles([{ id: 10, name: 'Team of 2' }])

        const result = refactorData(stats, titles, [100, 200])

        expect(result[100].steamId).toBeUndefined()
    })
})
