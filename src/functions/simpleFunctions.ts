import { Player, Rank } from '../types'

export function getTotalGames(ranks: Rank[]): number {
    let sum = 0
    for (const rank of ranks) {
        if (rank?.isModeRanked === 1) {
            sum += rank.wins + rank.losses
        }
    }
    return sum
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

export function formatToNums(arr: Player[]): Player[] {
    for (const player of arr) {
        if (player.profileId != null) {
            player.profileId = Number(player.profileId)
        }
        if (player.ranking != null) {
            player.ranking = Number(player.ranking)
        }
        if (player.teamSlot != null) {
            player.teamSlot = Number(player.teamSlot)
        }
    }
    return arr
}
