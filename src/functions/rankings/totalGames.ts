import { Rank } from '../../types'

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
