import { Rank } from '../types'
import { ranksArrFilter, ranksArrSort } from './ranksArrFuns'

const makeRank = (overrides: Partial<Rank> = {}): Rank =>
    ({
        name: '',
        rank: 0,
        wins: 0,
        losses: 0,
        streak: 0,
        ...overrides,
    }) as Rank

describe('ranksArrFilter', () => {
    const ranks = [
        makeRank({ name: 'Team of 2', rank: 100 }),
        makeRank({ name: 'Team of 4', rank: 0 }),
        makeRank({ name: '1v1 Soviet', rank: 50 }),
        makeRank({ name: '1v1 German', rank: -1 }),
    ]

    describe('tableView filtering', () => {
        it('filters to Team entries when tableView is true', () => {
            const result = ranksArrFilter(ranks, true, true)
            expect(result.map((r) => r.name)).toEqual(['Team of 2', 'Team of 4'])
        })

        it('includes all entries when tableView is false', () => {
            const result = ranksArrFilter(ranks, false, true)
            expect(result).toHaveLength(4)
        })
    })

    describe('showAll filtering', () => {
        it('keeps only ranked (rank > 0) when showAll is false', () => {
            const result = ranksArrFilter(ranks, false, false)
            expect(result.map((r) => r.name)).toEqual(['Team of 2', '1v1 Soviet'])
        })

        it('keeps all entries when showAll is true', () => {
            const result = ranksArrFilter(ranks, false, true)
            expect(result).toHaveLength(4)
        })
    })

    describe('combined filtering', () => {
        it('filters to ranked Team entries only', () => {
            const result = ranksArrFilter(ranks, true, false)
            expect(result.map((r) => r.name)).toEqual(['Team of 2'])
        })
    })

    it('returns empty array when no matches', () => {
        const result = ranksArrFilter([], false, false)
        expect(result).toEqual([])
    })
})

describe('ranksArrSort', () => {
    describe('non-byRank sorters', () => {
        it('sorts by win rate', () => {
            const ranks = [
                makeRank({ name: 'low', wins: 1, losses: 9 }),
                makeRank({ name: 'high', wins: 9, losses: 1 }),
            ]
            const result = ranksArrSort(ranks, { name: 'byWinRate', reversed: false })
            expect(result.map((r) => r.name)).toEqual(['high', 'low'])
        })

        it('sorts by streak', () => {
            const ranks = [
                makeRank({ name: 'low', streak: 1 }),
                makeRank({ name: 'high', streak: 5 }),
            ]
            const result = ranksArrSort(ranks, { name: 'byStreak', reversed: false })
            expect(result.map((r) => r.name)).toEqual(['high', 'low'])
        })
    })

    describe('byRank sorter', () => {
        it('sorts positive ranks ascending', () => {
            const ranks = [
                makeRank({ name: 'third', rank: 300 }),
                makeRank({ name: 'first', rank: 100 }),
                makeRank({ name: 'second', rank: 200 }),
            ]
            const result = ranksArrSort(ranks, { name: 'byRank', reversed: false })
            expect(result.map((r) => r.name)).toEqual(['first', 'second', 'third'])
        })

        it('places negative ranks after positive ranks', () => {
            const ranks = [
                makeRank({ name: 'neg', rank: -1, wins: 5, losses: 5 }),
                makeRank({ name: 'pos', rank: 10, wins: 1, losses: 1 }),
            ]
            const result = ranksArrSort(ranks, { name: 'byRank', reversed: false })
            expect(result.map((r) => r.name)).toEqual(['pos', 'neg'])
        })

        it('sorts negative ranks by total games descending', () => {
            const ranks = [
                makeRank({ name: 'few', rank: -1, wins: 1, losses: 1 }),
                makeRank({ name: 'many', rank: -1, wins: 10, losses: 10 }),
            ]
            const result = ranksArrSort(ranks, { name: 'byRank', reversed: false })
            expect(result.map((r) => r.name)).toEqual(['many', 'few'])
        })

        it('uses total games as tiebreaker for equal positive ranks', () => {
            const ranks = [
                makeRank({ name: 'few', rank: 5, wins: 1, losses: 1 }),
                makeRank({ name: 'many', rank: 5, wins: 10, losses: 10 }),
            ]
            const result = ranksArrSort(ranks, { name: 'byRank', reversed: false })
            expect(result.map((r) => r.name)).toEqual(['many', 'few'])
        })
    })
})
