jest.mock('string-width', () => ({
    __esModule: true,
    default: (s: string) => s.length,
}))

import { Player } from '../../types'
import { buildRankings } from './writeRankings'

const player = (overrides: Partial<Player> = {}): Player => ({
    name: 'TestPlayer',
    faction: 'german',
    teamSlot: 0,
    time: '12:00',
    ranking: 1200,
    country: 'FI',
    ...overrides,
})

describe('buildRankings', () => {
    describe('json output', () => {
        it('splits players into teams by teamSlot parity', () => {
            const players = [
                player({ name: 'A', teamSlot: 0 }),
                player({ name: 'B', teamSlot: 1 }),
                player({ name: 'C', teamSlot: 0 }),
                player({ name: 'D', teamSlot: 1 }),
            ]

            const { json } = buildRankings(false, players, false)

            expect(json.teams.team1.map((t) => t.name)).toEqual(['A', 'C'])
            expect(json.teams.team2.map((t) => t.name)).toEqual(['B', 'D'])
        })

        it('maps faction via commonName for coh2', () => {
            const { json } = buildRankings(false, [player({ faction: 'german' })], false)

            expect(json.teams.team1[0].faction).toBe('wer')
        })

        it('keeps raw faction for coh3', () => {
            const { json } = buildRankings(true, [player({ faction: 'germans' })], false)

            expect(json.teams.team1[0].faction).toBe('germans')
        })

        it('sets horizontal flag', () => {
            const { json: h } = buildRankings(false, [], true)
            const { json: v } = buildRankings(false, [], false)

            expect(h.horizontal).toBe(true)
            expect(v.horizontal).toBe(false)
        })

        it('formats ranking -1 as dash', () => {
            const { json } = buildRankings(false, [player({ ranking: -1 })], false)

            expect(json.teams.team1[0].ranking).toBe('-')
        })

        it('formats undefined ranking as dash', () => {
            const { json } = buildRankings(false, [player({ ranking: undefined })], false)

            expect(json.teams.team1[0].ranking).toBe('-')
        })
    })

    describe('text output', () => {
        it('produces vertical layout with teams separated by blank line', () => {
            const players = [
                player({ name: 'Axis1', teamSlot: 0 }),
                player({ name: 'Allies1', teamSlot: 1 }),
            ]

            const { text } = buildRankings(false, players, false)
            const blocks = text.split('\n\n')

            expect(blocks).toHaveLength(2)
            expect(blocks[0]).toContain('Allies1')
            expect(blocks[1]).toContain('Axis1')
        })

        it('produces horizontal layout with both teams on same line', () => {
            const players = [
                player({ name: 'Left', teamSlot: 0 }),
                player({ name: 'Right', teamSlot: 1 }),
            ]

            const { text } = buildRankings(false, players, true)
            const lines = text.trim().split('\n')

            expect(lines).toHaveLength(1)
            expect(lines[0]).toContain('Left')
            expect(lines[0]).toContain('Right')
        })

        it('truncates long names to 20 characters', () => {
            const longName = 'A'.repeat(30)
            const { text } = buildRankings(false, [player({ name: longName })], false)

            expect(text).not.toContain(longName)
            expect(text).toContain('A'.repeat(20))
        })
    })

    describe('rating output', () => {
        it('includes rating in json when showElo is true', () => {
            const { json } = buildRankings(
                true,
                [player({ faction: 'germans', rating: 1523 })],
                false,
                true
            )

            expect(json.teams.team1[0].rating).toBe(1523)
        })

        it('omits rating from json when showElo is false', () => {
            const { json } = buildRankings(
                true,
                [player({ faction: 'germans', rating: 1523 })],
                false,
                false
            )

            expect(json.teams.team1[0].rating).toBeUndefined()
        })

        it('includes rating in text output when showElo is true', () => {
            const { text } = buildRankings(
                true,
                [player({ faction: 'germans', rating: 1523 })],
                false,
                true
            )

            expect(text).toContain('(1523)')
        })

        it('does not include rating in text when showElo is false', () => {
            const { text } = buildRankings(
                true,
                [player({ faction: 'germans', rating: 1523 })],
                false,
                false
            )

            expect(text).not.toMatch(/\(\d+\)/)
        })
    })
})
