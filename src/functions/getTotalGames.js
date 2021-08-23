export default function getTotalGames(arr) {
    let sum = 0
    for (const rankObj of arr.ranks) {
        sum += rankObj.wins + rankObj.losses
    }
    return sum
}