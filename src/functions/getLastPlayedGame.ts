import { ExtraInfo } from '../types'

export default function getLastPlayedGame(playerData: ExtraInfo) {
    let last
    for (const rankObj of playerData.ranks) {
        if (rankObj.lastmatchdate) {
            if (last === undefined || last < rankObj.lastmatchdate) {
                last = rankObj.lastmatchdate
            }
        }
    }
    return last
}
