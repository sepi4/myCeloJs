import { Player } from '../../types'
import { separateTeams } from './separateTeams'

const makePlayer = (overrides: Partial<Player> = {}): Player => ({
    faction: 'soviet',
    name: 'player',
    teamSlot: 0,
    time: '',
    ...overrides,
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
