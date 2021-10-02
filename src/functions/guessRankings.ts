import {
    copyObj,
    formatToNums,
    separateTeams,
    getFactionName,
} from './simpleFunctions';

import {
    PlayerFromFile,
    AvailableLeaderboard,
    PersonalStats,
    StatGroup,
    LeaderboardStatWithRankToTeam,
} from '../types';

function getStatGrops(team: PlayerFromFile[], data: PersonalStats) {
    const len = team.length;
    for (let i = len; i > 1; i--) {
        let statGroups = data.statGroups
            .filter((s) => s.type === i)
            .filter((s) =>
                s.members.every((el) =>
                    team.find((m) => m.profileId === el.profile_id)
                )
            );

        if (statGroups.length >= 1) {
            return statGroups;
        }
    }
    return [];
}

function addRankToTeamLeaderboardStats(
    statGroups: StatGroup[],
    data: PersonalStats,
    leaderboardId: number | undefined
) {
    let arr: LeaderboardStatWithRankToTeam[] = [];
    let teamIndex = 1;
    data.leaderboardStats.forEach((ls: LeaderboardStatWithRankToTeam) => {
        statGroups.forEach((sg) => {
            if (
                ls.statgroup_id === sg.id &&
                ls.leaderboard_id === leaderboardId &&
                !arr.find(
                    // no duplicates
                    (x) =>
                        x.statgroup_id === ls.statgroup_id &&
                        x.leaderboard_id === ls.leaderboard_id
                )
            ) {
                arr.push(ls);
                let teamMarker;
                if (teamIndex === 1) {
                    teamMarker = ' ¹';
                } else {
                    teamMarker = ' ²';
                }

                if (!ls.rank || ls.rank < 1) {
                    ls.rank = '-';
                }

                sg.rank = ls.rank + teamMarker;
                teamIndex++;
            }
        });
    });
    // return arr;
}

function factionSide(team: PlayerFromFile[]) {
    const isAllies = team.every(
        (p) =>
            p.faction === 'british' ||
            p.faction === 'aef' ||
            p.faction === 'soviet'
    );

    const isAxis = team.every(
        (p) => p.faction === 'west_german' || p.faction === 'german'
    );

    if (isAllies) {
        return 'allies';
    } else if (isAxis) {
        return 'axis';
    } else {
        return undefined;
    }
}

function getTitleName(teamLen: number, side: string | undefined) {
    let size = teamLen;
    if (side === undefined) {
        return undefined;
    }
    if (size < 2) {
        return undefined;
    }
    if (side === 'allies') {
        return 'TeamOf' + size + 'Allies';
    } else if (side === 'axis') {
        return 'TeamOf' + size + 'Axis';
    }
}

function getLeaderboardId(
    titleName: string | undefined,
    titles: AvailableLeaderboard
) {
    let obj = titles.leaderboards.find((t) => t.name === titleName);
    if (obj) {
        return obj.id;
    }
}

function getTitlesLeaderboardId(name: string, titles: AvailableLeaderboard) {
    let obj = titles.leaderboards.find((obj) => obj.name === name);
    if (obj) {
        return obj.id;
    }
}

function getPlayerStatGroup(playerId: number | undefined, data: PersonalStats) {
    if (playerId) {
        return data.statGroups.find(
            (obj) => obj.type === 1 && obj.members[0].profile_id === playerId
        );
    }
}

function getPlayerLeaderboardStat(
    statGroupId: number | undefined,
    leaderboardId: number | undefined,
    data: PersonalStats
) {
    return data.leaderboardStats.find(
        (obj) =>
            obj.statgroup_id === statGroupId &&
            obj.leaderboard_id === leaderboardId
    );
}

function findInStatGroups(statGroups: StatGroup[], player: PlayerFromFile) {
    for (const sg of statGroups) {
        for (const m of sg.members) {
            if (m.profile_id === player.profileId) {
                return sg;
            }
        }
    }
}

export function guessRankings(
    playersArr: PlayerFromFile[],
    data: PersonalStats,
    titles: AvailableLeaderboard
) {
    function rankToRandomPlayer(
        team: PlayerFromFile[],
        player: PlayerFromFile
    ) {
        let s = team.length;
        let fn = getFactionName(player.faction);
        let matchTypeName = `${s}v${s}${fn}`;
        let leaderboardId = getTitlesLeaderboardId(matchTypeName, titles);

        let playerId = player.profileId;
        let playerStatGroup = getPlayerStatGroup(playerId, data);

        let playerStatGroupId;
        if (playerStatGroup) {
            playerStatGroupId = playerStatGroup.id;
        }

        let pls = getPlayerLeaderboardStat(
            playerStatGroupId,
            leaderboardId,
            data
        );

        if (pls && pls.rank) {
            player.ranking = pls.rank;
        }
    }

    let arr: PlayerFromFile[] = formatToNums(copyObj(playersArr));
    let teams: [PlayerFromFile[], PlayerFromFile[]] = separateTeams(arr);

    for (const team of teams) {
        const side = factionSide(team);

        const statGroups = getStatGrops(team, data);

        if (statGroups.length > 0 && team.length > 1) {
            const modeName = getTitleName(statGroups[0].members.length, side);
            const leaderboardId = getLeaderboardId(modeName, titles);
            addRankToTeamLeaderboardStats(statGroups, data, leaderboardId);
            team.forEach((player) => {
                const sg = findInStatGroups(statGroups, player);
                if (sg) {
                    player.ranking = sg.rank;
                } else {
                    rankToRandomPlayer(team, player);
                }
            });
        } else {
            for (let player of team) {
                rankToRandomPlayer(team, player);
            }
        }
    }

    // adding country to player
    for (let t of teams) {
        for (const player of t) {
            if (player.profileId) {
                for (let sg of data.statGroups) {
                    for (let m of sg.members) {
                        if (m.profile_id === player.profileId) {
                            player.country = m.country;
                            break;
                        }
                    }
                    if (player.country) {
                        break;
                    }
                }
            }
        }
    }

    // console.log('teams:', teams);
    return teams;
}
