import { RELIC_SERVER_BASE } from '../constants'
import {
    RecentMatchHistory,
    MatchHistoryReportResult,
    MatchHistoryStat,
    AvailableLeaderboard,
    MatchType,
    Profile,
} from '../types'

export const getHistoryUrls = (id: string) => {
    const url = `${RELIC_SERVER_BASE}/getRecentMatchHistory?title=coh2&profile_ids=[${id}]`
    const url2 = `${RELIC_SERVER_BASE}/GetAvailableLeaderboards?title=coh2`
    return [url, url2]
}

type Result = [{ data: RecentMatchHistory }, { data: AvailableLeaderboard }];
type Player = {
    profileId: string;
};

export const parseHistoryData = (result: Result, player: Player) => {
    // console.log('result:', result);
    // console.log('player:', player);

    const { data } = result[0]
    const { matchTypes } = result[1].data
    const { matchHistoryStats, profiles } = data
    const matches = matchHistoryStats.sort((a, b) => {
        return b.completiontime - a.completiontime
    })

    type MatchObject = {
        startGameTime: Date;
        endGameTime: Date;
        mapName: string;
        players: MatchHistoryReportResult[];
        matchType: MatchType | undefined;
        description: string;
        all: MatchHistoryStat;
        result: MatchHistoryReportResult | undefined;
        counters: string | undefined;
    };

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
            return r.profile_id.toString() === player.profileId.toString()
        })

        mObj.counters = mObj.result?.counters
        matchesArr.push(mObj)
    })

    type ProfilesObj = {
        [key: number]: Profile;
    };
    const profilesObj: ProfilesObj = {}
    for (const p of profiles) {
        profilesObj[p.profile_id] = p
    }
    return {
        matchHistoryStats: matchesArr,
        profiles: profilesObj,
    }
}
