import { Rank } from '../types'
import { refactronTableInfo, refactronTableInfoCoh3 } from './refactorTableInfo'

const makeRank = (name: string, wins = 5, losses = 3): Rank => ({
    name,
    wins,
    losses,
    disputes: 0,
    drops: 0,
    lastmatchdate: 0,
    leaderboard_id: 0,
    rank: 100,
    ranklevel: 1,
    ranktotal: 500,
    regionrank: 0,
    regionranktotal: 0,
    statgroup_id: 0,
    streak: 2,
})

describe('refactronTableInfo (COH2)', () => {
    test('returns 20 undefined slots for empty input', () => {
        const [solo, names] = refactronTableInfo([])
        expect(names).toEqual(['sov', 'wer', 'usa', 'okw', 'uk'])
        expect(solo).toHaveLength(20)
        expect(solo.every((x) => x === undefined)).toBe(true)
    })

    test('places ranks in correct faction slots', () => {
        const sov1 = makeRank('1v1Soviet')
        const ger2 = makeRank('2v2German')
        const [solo] = refactronTableInfo([sov1, ger2])
        expect(solo[0]).toBe(sov1)
        expect(solo[5]).toBe(ger2)
    })

    test('ignores unrecognized names', () => {
        const [solo] = refactronTableInfo([makeRank('1v1Unknown')])
        expect(solo.every((x) => x === undefined)).toBe(true)
    })
})

describe('refactronTableInfoCoh3', () => {
    test('returns 16 undefined slots for empty input', () => {
        const [solo, names] = refactronTableInfoCoh3([])
        expect(names).toEqual(['afrika_korps', 'germans', 'americans', 'british_africa'])
        expect(solo).toHaveLength(16)
        expect(solo.every((x) => x === undefined)).toBe(true)
    })

    test('places ranks in correct faction slots', () => {
        const dak1 = makeRank('1v1DAK')
        const ame2 = makeRank('2v2American')
        const [solo] = refactronTableInfoCoh3([dak1, ame2])
        expect(solo[0]).toBe(dak1)
        expect(solo[9]).toBe(ame2)
    })

    test('matches Unranked variants correctly', () => {
        const r1 = makeRank('1v1AmericanUnranked')
        const r2 = makeRank('2v2DAKUnranked')
        const [solo] = refactronTableInfoCoh3([r1, r2])
        expect(solo[8]).toBe(r1)
        expect(solo[1]).toBe(r2)
    })
})
