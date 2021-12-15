import { LeaderboardStat, Member } from '../types'

type Rank = {
    name: string;
    members: Member[];
} & LeaderboardStat;

type PlayerData = {
    ranks: Rank[];
    steamId: string;
};

export default function getLastPlayedGame(playerData: PlayerData) {
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
