import { RELIC_SERVER_BASE } from '../constants'
import {
    RecentMatchHistory,
    AvailableLeaderboard,
    Player,
    MatchObject,
    NormalizedProfiles,
} from '../types'

export const getHistoryUrls = (id: number | undefined) => {
    const url = `${RELIC_SERVER_BASE}/getRecentMatchHistoryByProfileId?title=coh2&profile_id=${id}`
    const url2 = `${RELIC_SERVER_BASE}/GetAvailableLeaderboards?title=coh2`
    return [url, url2]
}

type Result = [{ data: RecentMatchHistory }, { data: AvailableLeaderboard }]

export const parseHistoryData = (result: Result, player: Player) => {
    const { data } = result[0]
    const { matchTypes } = result[1].data
    const { matchHistoryStats, profiles } = data
    const matches = matchHistoryStats.sort((a, b) => {
        return b.completiontime - a.completiontime
    })

    const matchesArr: MatchObject[] = []

    matches.forEach((m) => {
        const mObj = <MatchObject>{}
        mObj.startGameTime = new Date(m.startgametime * 1000)
        mObj.endGameTime = new Date(m.completiontime * 1000)
        mObj.mapName = m.mapname
        mObj.players = m.matchhistoryreportresults.map((p) => {
            p.counters = JSON.parse(p.counters)
            return p
        })
        mObj.matchType = matchTypes.find((t) => t.id === m.matchtype_id)
        mObj.description = m.description
        mObj.all = m
        if (mObj.players.length === 0) {
            return
        }
        mObj.result = m.matchhistoryreportresults.find((r) => {
            // TODO === fix string profileId
            return r.profile_id == player.profileId
        })

        mObj.counters = mObj.result?.counters
        if (result) {
            matchesArr.push(mObj)
        }
    })

    const profilesObj: NormalizedProfiles = {}
    for (const p of profiles) {
        profilesObj[p.profile_id] = p
    }
    return {
        matchHistoryStats: matchesArr,
        profiles: profilesObj,
    }
}
