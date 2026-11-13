import { PlayerRanks } from '../../types'

export default function getLastPlayedGame(playerData: PlayerRanks) {
    let last
    for (const rank of playerData.ranks) {
        if (rank.lastmatchdate) {
            if (last === undefined || last < rank.lastmatchdate) {
                last = rank.lastmatchdate
            }
        }
    }
    return last
}
