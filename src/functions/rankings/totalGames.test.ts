import { Rank } from '../../types'
import { getTotalGames } from './totalGames'

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
