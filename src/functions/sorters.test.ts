import sorters from './sorters'

const { byRank, byWinRate, byStreak, byName, byTotal } = sorters

const makeRank = (
    overrides: Partial<{
        rank: number
        wins: number
        losses: number
        streak: number
        name: string
    }> = {}
) => ({
    rank: 0,
    wins: 0,
    losses: 0,
    streak: 0,
    name: '',
    ...overrides,
})

describe('sorters', () => {
    describe('byRank', () => {
        it('sorts by rank ascending', () => {
            const ranks = [makeRank({ rank: 3 }), makeRank({ rank: 1 }), makeRank({ rank: 2 })]
            ranks.sort(byRank)
            expect(ranks.map((r) => r.rank)).toEqual([1, 2, 3])
        })
    })

    describe('byWinRate', () => {
        it('sorts by win rate descending', () => {
            const ranks = [
                makeRank({ name: 'low', wins: 1, losses: 3 }), // 25%
                makeRank({ name: 'high', wins: 3, losses: 1 }), // 75%
                makeRank({ name: 'mid', wins: 1, losses: 1 }), // 50%
            ]
            ranks.sort(byWinRate)
            expect(ranks.map((r) => r.name)).toEqual(['high', 'mid', 'low'])
        })

        it('handles zero games', () => {
            const a = makeRank({ wins: 0, losses: 0 })
            const b = makeRank({ wins: 1, losses: 1 })
            expect(byWinRate(a, b)).toEqual(NaN)
        })
    })

    describe('byStreak', () => {
        it('sorts by streak descending', () => {
            const ranks = [
                makeRank({ streak: 1 }),
                makeRank({ streak: 5 }),
                makeRank({ streak: 3 }),
            ]
            ranks.sort(byStreak)
            expect(ranks.map((r) => r.streak)).toEqual([5, 3, 1])
        })
    })

    describe('byName', () => {
        it('sorts alphabetically case-insensitive', () => {
            const ranks = [
                makeRank({ name: 'Charlie' }),
                makeRank({ name: 'alice' }),
                makeRank({ name: 'Bob' }),
            ]
            ranks.sort(byName)
            expect(ranks.map((r) => r.name)).toEqual(['alice', 'Bob', 'Charlie'])
        })

        it('returns 0 for equal names', () => {
            const a = makeRank({ name: 'Alice' })
            const b = makeRank({ name: 'alice' })
            expect(byName(a, b)).toBe(0)
        })
    })

    describe('byTotal', () => {
        it('sorts by total games descending', () => {
            const ranks = [
                makeRank({ wins: 2, losses: 1 }), // 3
                makeRank({ wins: 5, losses: 5 }), // 10
                makeRank({ wins: 3, losses: 3 }), // 6
            ]
            ranks.sort(byTotal)
            expect(ranks.map((r) => r.wins + r.losses)).toEqual([10, 6, 3])
        })
    })
})
