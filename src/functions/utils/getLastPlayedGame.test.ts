import { PlayerRanks, Rank } from '../../types'
import getLastPlayedGame from './getLastPlayedGame'

const makeRank = (lastmatchdate: number): Partial<Rank> => ({ lastmatchdate })

const makePlayerRanks = (ranks: Partial<Rank>[]): PlayerRanks => ({
    ranks: ranks as Rank[],
})

describe('getLastPlayedGame', () => {
    it('returns the most recent match date', () => {
        const data = makePlayerRanks([makeRank(100), makeRank(300), makeRank(200)])
        expect(getLastPlayedGame(data)).toBe(300)
    })

    it('returns undefined when ranks is empty', () => {
        const data = makePlayerRanks([])
        expect(getLastPlayedGame(data)).toBeUndefined()
    })

    it('returns the date when only one rank exists', () => {
        const data = makePlayerRanks([makeRank(42)])
        expect(getLastPlayedGame(data)).toBe(42)
    })

    it('skips ranks with falsy lastmatchdate', () => {
        const data = makePlayerRanks([makeRank(0), makeRank(100), makeRank(0)])
        expect(getLastPlayedGame(data)).toBe(100)
    })
})
