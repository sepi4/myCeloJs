export const getHistoryUrls = id => {

    const url = 'https://coh2-api.reliclink.com/community/leaderboard/'
        + 'getRecentMatchHistory?title=coh2&profile_ids=['
        + id
        + ']'
    const url2 = 'https://coh2-api.reliclink.com/'
        + 'community/leaderboard/GetAvailableLeaderboards?title=coh2'

    return [url, url2]
}
export const parseHistoryData = (result, player) => {
    let matchesArr = []

    const { data } = result[0]
    const { matchTypes } = result[1].data
    const { matchHistoryStats, profiles } = data
    const matches = matchHistoryStats.sort((a, b) => {
        return b.completiontime - a.completiontime
    })

    matches.forEach((m) => {
        let mObj = {}
        mObj.startGameTime = new Date(m.startgametime * 1000)
        mObj.endGameTime = new Date(m.completiontime * 1000)
        mObj.mapName = m.mapname
        mObj.players = m.matchhistoryreportresults.map((p) => {
            p.counters = JSON.parse(p.counters)
            return p
        })
        mObj.matchType = matchTypes.find(
            (t) => t.id === m.matchtype_id,
        )
        mObj.description = m.description
        mObj.all = m
        if (mObj.players.length === 0) {
            return
        }
        mObj.result = m.matchhistoryreportresults.find((r) => {
            return r.profile_id.toString() === player.profileId.toString()
        })

        mObj.counters = mObj.result.counters
        matchesArr.push(mObj)
    })

    let profilesObj = {}
    profiles.forEach((p) => (profilesObj[p.profile_id] = p))
    return {
        matchHistoryStats: matchesArr,
        profiles: profilesObj,
    }
}