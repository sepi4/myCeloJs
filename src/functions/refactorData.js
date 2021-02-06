export function refactorData(leaderboard, cohTitles, ids) {
    // leaderboard:
    //         -leaderboardStats: []
    //                  - statGroup_id
    //                  - leaderboard_id
    //                  - rank
    //                  ...
    //          -statGroups: []
    //                      - id
    //                      - members: []
    //                              - name (steam id)
    //                              - alias
    //                              - personal_statgroup_id

    // cohTitles:
    //         -leaderboards: []
    //             - id
    //             - name

    let players = {}
    for (const id of ids) {
        players[id] = {
            ranks: [],
        }
    }

    let statGroups = {}
    for (const x of leaderboard.statGroups) {
        statGroups[x.id] = x
    }

    let names = {}
    // for (const x of cohTitles.leaderboards) {
    // get all that are ranked
    for (const x of cohTitles.leaderboards.filter(l => l.isranked === 1)) {
        names[x.id] = x.name
    }

    // for (const x of leaderboard.leaderboardStats.filter(l => l.rank > -1)) {
    for (const x of leaderboard.leaderboardStats) {
        // check members

        let group = statGroups[x.statgroup_id]


        for (const member of group.members) {
            let id = member.profile_id
            if (
                players[id]
                && !players[id].ranks.find(y =>
                    y.statgroup_id === x.statgroup_id &&
                    y.leaderboard_id === x.leaderboard_id
                )
                && names[x.leaderboard_id]
            ) {
                players[id].ranks.push({
                    members: group.members,
                    name: names[x.leaderboard_id],
                    ...x,
                })
                break
            }
        }
    }

    return players
}