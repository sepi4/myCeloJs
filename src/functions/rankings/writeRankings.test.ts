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

            const { json } = buildRankings('coh2', players, { horizontal: false })

            expect(json.teams.team1.map((t) => t.name)).toEqual(['A', 'C'])
            expect(json.teams.team2.map((t) => t.name)).toEqual(['B', 'D'])
        })

        it('maps faction via getFactionCode for coh2', () => {
            const { json } = buildRankings('coh2', [player({ faction: 'german' })], {
                horizontal: false,
            })

            expect(json.teams.team1[0]!.faction).toBe('wer')
        })

        it('keeps raw faction for coh3', () => {
            const { json } = buildRankings('coh3', [player({ faction: 'germans' })], {
                horizontal: false,
            })

            expect(json.teams.team1[0]!.faction).toBe('germans')
        })

        it('sets horizontal flag', () => {
            const { json: h } = buildRankings('coh2', [], { horizontal: true })
            const { json: v } = buildRankings('coh2', [], { horizontal: false })

            expect(h.horizontal).toBe(true)
            expect(v.horizontal).toBe(false)
        })

        it('formats undefined ranking as dash', () => {
            const { json } = buildRankings('coh2', [player({ ranking: undefined })], {
                horizontal: false,
            })

            expect(json.teams.team1[0]!.ranking).toBe('-')
        })
    })

    describe('text output', () => {
        it('produces vertical layout with teams separated by blank line', () => {
            const players = [
                player({ name: 'Axis1', teamSlot: 0 }),
                player({ name: 'Allies1', teamSlot: 1 }),
            ]

            const { text } = buildRankings('coh2', players, { horizontal: false })
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

            const { text } = buildRankings('coh2', players, { horizontal: true })
            const lines = text.trim().split('\n')

            expect(lines).toHaveLength(1)
            expect(lines[0]).toContain('Left')
            expect(lines[0]).toContain('Right')
        })

        it('truncates long names to 20 characters', () => {
            const longName = 'A'.repeat(30)
            const { text } = buildRankings('coh2', [player({ name: longName })], {
                horizontal: false,
            })

            expect(text).not.toContain(longName)
            expect(text).toContain('A'.repeat(20))
        })
    })

    describe('rating output', () => {
        it('includes rating in json when showElo is true', () => {
            const { json } = buildRankings('coh3', [player({ faction: 'germans', rating: 1523 })], {
                showElo: true,
            })

            expect(json.teams.team1[0]!.rating).toBe(1523)
        })

        it('omits rating from json when showElo is false', () => {
            const { json } = buildRankings('coh3', [player({ faction: 'germans', rating: 1523 })], {
                showElo: false,
            })

            expect(json.teams.team1[0]!.rating).toBeUndefined()
        })

        it('includes rating in text output when showElo is true', () => {
            const { text } = buildRankings('coh3', [player({ faction: 'germans', rating: 1523 })], {
                showElo: true,
            })

            expect(text).toContain('(1523)')
        })

        it('pads a player without a rating, so the text lines stay aligned', () => {
            for (const horizontal of [false, true]) {
                const players = [
                    player({ faction: 'germans', rating: 1523, teamSlot: 0 }),
                    player({ faction: 'germans', rating: undefined, teamSlot: 2 }),
                ]
                const { text } = buildRankings('coh3', players, { showElo: true, horizontal })
                const [rated, unrated] = text.split('\n').filter((line) => line.trim())

                expect(unrated!.length).toBe(rated!.length)
            }
        })

        it('does not include rating in text when showElo is false', () => {
            const { text } = buildRankings('coh3', [player({ faction: 'germans', rating: 1523 })], {
                showElo: false,
            })

            expect(text).not.toMatch(/\(\d+\)/)
        })
    })

    describe('country output', () => {
        it('keeps the country in json and text by default', () => {
            const { json, text } = buildRankings('coh2', [player({ country: 'fi' })], {
                horizontal: false,
            })

            expect(json.showCountry).toBe(true)
            expect(json.teams.team1[0]!.country).toBe('fi')
            expect(text).toContain('FIN')
        })

        it('leaves the country out of json and text when the country is hidden', () => {
            for (const horizontal of [false, true]) {
                const players = [
                    player({ name: 'A', country: 'fi', teamSlot: 0 }),
                    player({ name: 'B', country: 'fi', teamSlot: 1 }),
                ]
                const { json, text } = buildRankings('coh2', players, {
                    horizontal,
                    showCountry: false,
                })

                expect(json.showCountry).toBe(false)
                expect(json.teams.team1[0]!.country).toBeUndefined()
                expect(json.teams.team2[0]!.country).toBeUndefined()
                expect(text).not.toContain('FIN')
            }
        })
    })

    describe('avatar output', () => {
        const avatars = { 7: 'https://example.com/a.jpg' }

        it('adds the avatar by profile ID when shown', () => {
            const { json } = buildRankings('coh2', [player({ profileId: 7 })], {
                showAvatar: true,
                avatars,
            })

            expect(json.showAvatar).toBe(true)
            expect(json.teams.team1[0]!.avatar).toBe('https://example.com/a.jpg')
        })

        it('leaves the avatar out by default', () => {
            const { json } = buildRankings('coh2', [player({ profileId: 7 })], { avatars })

            expect(json.showAvatar).toBe(false)
            expect(json.teams.team1[0]!.avatar).toBeUndefined()
        })
    })
})
