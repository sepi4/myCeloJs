import { AvailableLeaderboard, PersonalStats, StatGroup } from '../types';

type Player = {
    ranks: any[];
    steamId?: string;
};
type Players = { [key: string]: Player };

export function refactorData(
    leaderboard: PersonalStats,
    cohTitles: AvailableLeaderboard,
    ids: number[]
): Players {
    let players: Players = {};
    for (const id of ids) {
        players[id] = {
            ranks: [],
        };
    }

    let statGroups: { [key: number]: StatGroup } = {};
    for (const x of leaderboard.statGroups) {
        statGroups[x.id] = x;
    }

    type TL = {
        name: string;
        isRanked: number;
    };
    let titlesLeadersboards: { [key: number]: TL } = {};
    // get all that are ranked
    // for (const x of cohTitles.leaderboards.filter(l => l.isranked === 1)) {

    for (const x of cohTitles.leaderboards) {
        // titlesLeadersboards[x.id] =  x.name
        titlesLeadersboards[x.id] = {
            name: x.name,
            isRanked: x.isranked,
        };
    }

    // for (const x of leaderboard.leaderboardStats.filter(l => l.rank > -1)) {
    for (const x of leaderboard.leaderboardStats) {
        // check members

        let group = statGroups[x.statgroup_id];

        for (const member of group.members) {
            let id = member.profile_id;

            if (
                players[id] &&
                !players[id].ranks.find(
                    (y) =>
                        y.statgroup_id === x.statgroup_id &&
                        y.leaderboard_id === x.leaderboard_id
                ) &&
                titlesLeadersboards[x.leaderboard_id]
            ) {
                players[id].ranks.push({
                    members: group.members,
                    name: titlesLeadersboards[x.leaderboard_id].name,
                    isModeRanked:
                        titlesLeadersboards[x.leaderboard_id].isRanked,
                    ...x,
                });
                break;
            }
        }
    }

    // add steamId to extraInfo
    for (let id of Object.keys(players)) {
        if (players[id].steamId) {
            break;
        }
        for (let rankObj of players[id].ranks) {
            if (rankObj.members.length === 1) {
                players[id].steamId = rankObj.members[0].name.substring(7);
                break;
            }
        }
    }

    return players;
}
