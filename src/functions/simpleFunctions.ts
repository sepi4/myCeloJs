import { Player, Rank } from '../types'

export function getTotalGames(ranks: Rank[]): number {
    let sum = 0
    for (const rankObj of ranks) {
        if (rankObj?.isModeRanked === 1) {
            sum += rankObj.wins + rankObj.losses
        }
    }
    return sum
}

export function separateTeams(arr: Player[]): [Player[], Player[]] {
    const teams: [Player[], Player[]] = [[], []]
    for (const obj of arr) {
        if (obj.teamSlot === 0) {
            teams[0].push(obj)
        } else {
            teams[1].push(obj)
        }
    }
    return teams
}

export function formatToNums(arr: Player[]): Player[] {
    for (const obj of arr) {
        if (obj.profileId && !isNaN(obj.profileId)) {
            obj.profileId = Number(obj.profileId)
        }
        if (obj.ranking && typeof obj.ranking === 'number' && !isNaN(obj.ranking)) {
            obj.ranking = Number(obj.ranking)
        }
        if (obj.teamSlot && !isNaN(obj.teamSlot)) {
            obj.teamSlot = Number(obj.teamSlot)
        }
    }
    return arr
}
