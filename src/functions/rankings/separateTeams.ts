import { Player } from '../../types'

export function separateTeams(players: Player[]): [Player[], Player[]] {
    const teams: [Player[], Player[]] = [[], []]
    for (const player of players) {
        if (player.teamSlot === 0) {
            teams[0].push(player)
        } else {
            teams[1].push(player)
        }
    }
    return teams
}
