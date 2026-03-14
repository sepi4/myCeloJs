import { ExtraInfo, Rank } from '../types'
import getLastPlayedGame from './getLastPlayedGame'

const makeRank = (lastmatchdate: number): Partial<Rank> => ({ lastmatchdate })

const makeExtraInfo = (ranks: Partial<Rank>[]): ExtraInfo => ({
    ranks: ranks as Rank[],
})

describe('getLastPlayedGame', () => {
    it('returns the most recent match date', () => {
        const data = makeExtraInfo([makeRank(100), makeRank(300), makeRank(200)])
        expect(getLastPlayedGame(data)).toBe(300)
    })

    it('returns undefined when ranks is empty', () => {
        const data = makeExtraInfo([])
        expect(getLastPlayedGame(data)).toBeUndefined()
    })

    it('returns the date when only one rank exists', () => {
        const data = makeExtraInfo([makeRank(42)])
        expect(getLastPlayedGame(data)).toBe(42)
    })

    it('skips ranks with falsy lastmatchdate', () => {
        const data = makeExtraInfo([makeRank(0), makeRank(100), makeRank(0)])
        expect(getLastPlayedGame(data)).toBe(100)
    })
})
