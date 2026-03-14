import { Player, Rank } from '../types'
import { formatToNums, getTotalGames, separateTeams } from './simpleFunctions'

const makePlayer = (overrides: Partial<Player> = {}): Player => ({
    faction: 'soviet',
    name: 'player',
    teamSlot: 0,
    time: '',
    ...overrides,
})

describe('simpleFunctions', () => {
    describe('getTotalGames', () => {
        it('sums wins and losses for ranked modes only', () => {
            const ranks = [
                { losses: 10, wins: 1, isModeRanked: 1 },
                { losses: 20, wins: 2, isModeRanked: 1 },
                { losses: 1, wins: 1, isModeRanked: 0 },
            ]
            expect(getTotalGames(ranks as Rank[])).toBe(33)
        })

        it('returns 0 when no ranked modes', () => {
            const ranks = [
                { losses: 111, wins: 11, isModeRanked: 0 },
                { losses: 111, wins: 111, isModeRanked: 0 },
            ]
            expect(getTotalGames(ranks as Rank[])).toBe(0)
        })

        it('returns 0 for empty array', () => {
            expect(getTotalGames([])).toBe(0)
        })
    })

    describe('separateTeams', () => {
        it('splits players by teamSlot', () => {
            const players = [
                makePlayer({ name: 'a', teamSlot: 0 }),
                makePlayer({ name: 'b', teamSlot: 1 }),
                makePlayer({ name: 'c', teamSlot: 0 }),
                makePlayer({ name: 'd', teamSlot: 1 }),
            ]
            const [team0, team1] = separateTeams(players)
            expect(team0.map((p) => p.name)).toEqual(['a', 'c'])
            expect(team1.map((p) => p.name)).toEqual(['b', 'd'])
        })

        it('returns empty arrays when no players', () => {
            const [team0, team1] = separateTeams([])
            expect(team0).toEqual([])
            expect(team1).toEqual([])
        })

        it('puts all players in team0 when all have teamSlot 0', () => {
            const players = [makePlayer({ name: 'a' }), makePlayer({ name: 'b' })]
            const [team0, team1] = separateTeams(players)
            expect(team0).toHaveLength(2)
            expect(team1).toHaveLength(0)
        })
    })

    describe('formatToNums', () => {
        it('converts string profileId to number', () => {
            const players = [makePlayer({ profileId: '123' as unknown as number })]
            const result = formatToNums(players)
            expect(result[0].profileId).toBe(123)
            expect(typeof result[0].profileId).toBe('number')
        })

        it('converts string teamSlot to number', () => {
            const players = [makePlayer({ teamSlot: '1' as unknown as number })]
            const result = formatToNums(players)
            expect(result[0].teamSlot).toBe(1)
            expect(typeof result[0].teamSlot).toBe('number')
        })

        it('leaves already-numeric values unchanged', () => {
            const players = [makePlayer({ profileId: 123, teamSlot: 1 })]
            const result = formatToNums(players)
            expect(result[0].profileId).toBe(123)
            expect(result[0].teamSlot).toBe(1)
        })

        it('mutates the original array', () => {
            const players = [makePlayer({ profileId: '456' as unknown as number })]
            const result = formatToNums(players)
            expect(result).toBe(players)
        })
    })
})
