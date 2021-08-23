export default function getLastPlayedGame(arr) {
    let last
    for (const rankObj of arr.ranks) {
        if (rankObj.lastmatchdate) {
            if (last === undefined || last < rankObj.lastmatchdate) {
                last = rankObj.lastmatchdate
            }
        }
    }
    return last
}