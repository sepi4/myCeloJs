import { Rank } from '../../types'
import { groupSoloRanksByFaction } from './groupSoloRanksByFaction'

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

describe('groupSoloRanksByFaction (COH2)', () => {
    test('returns 20 undefined slots for empty input', () => {
        const [solo, names] = groupSoloRanksByFaction('coh2', [])
        expect(names).toEqual(['sov', 'wer', 'usa', 'okw', 'uk'])
        expect(solo).toHaveLength(20)
        expect(solo.every((x) => x === undefined)).toBe(true)
    })

    test('places ranks in correct faction slots', () => {
        const sov1 = makeRank('1v1Soviet')
        const ger2 = makeRank('2v2German')
        const [solo] = groupSoloRanksByFaction('coh2', [sov1, ger2])
        expect(solo[0]).toBe(sov1)
        expect(solo[5]).toBe(ger2)
    })

    test('ignores unrecognized names', () => {
        const [solo] = groupSoloRanksByFaction('coh2', [makeRank('1v1Unknown')])
        expect(solo.every((x) => x === undefined)).toBe(true)
    })
})

describe('groupSoloRanksByFaction (COH3)', () => {
    test('returns 16 undefined slots for empty input', () => {
        const [solo, names] = groupSoloRanksByFaction('coh3', [])
        expect(names).toEqual(['dak', 'wer', 'usa', 'uk'])
        expect(solo).toHaveLength(16)
        expect(solo.every((x) => x === undefined)).toBe(true)
    })

    test('places ranks in correct faction slots', () => {
        const dak1 = makeRank('1v1DAK')
        const ame2 = makeRank('2v2American')
        const [solo] = groupSoloRanksByFaction('coh3', [dak1, ame2])
        expect(solo[0]).toBe(dak1)
        expect(solo[9]).toBe(ame2)
    })

    test('matches Unranked variants correctly', () => {
        const r1 = makeRank('1v1AmericanUnranked')
        const r2 = makeRank('2v2DAKUnranked')
        const [solo] = groupSoloRanksByFaction('coh3', [r1, r2])
        expect(solo[8]).toBe(r1)
        expect(solo[1]).toBe(r2)
    })
})
