import { GAME_CONFIG, GAMES } from '../../constants/games'
import { samplePlayers } from './samplePlayers'

describe('samplePlayers', () => {
    it.each(GAMES)('gives four players to each team with %s factions', (game) => {
        const players = samplePlayers(game)
        const logNames = GAME_CONFIG[game].factions.map((f) => f.logName)

        expect(players.filter((p) => p.teamSlot % 2 === 0)).toHaveLength(4)
        expect(players.filter((p) => p.teamSlot % 2 === 1)).toHaveLength(4)
        for (const player of players) {
            expect(logNames).toContain(player.faction)
        }
    })
})
