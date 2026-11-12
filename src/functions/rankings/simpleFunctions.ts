import { Player, Rank } from '../../types'

/** Counts only ranked modes. */
export function getTotalWinsAndLosses(ranks: Rank[]): { wins: number; losses: number } {
    let wins = 0
    let losses = 0
    for (const rank of ranks) {
        if (rank?.isModeRanked === 1) {
            wins += rank.wins
            losses += rank.losses
        }
    }
    return { wins, losses }
}

export function getTotalGames(ranks: Rank[]): number {
    const { wins, losses } = getTotalWinsAndLosses(ranks)
    return wins + losses
}

export function separateTeams(arr: Player[]): [Player[], Player[]] {
    const teams: [Player[], Player[]] = [[], []]
    for (const player of arr) {
        if (player.teamSlot === 0) {
            teams[0].push(player)
        } else {
            teams[1].push(player)
        }
    }
    return teams
}
