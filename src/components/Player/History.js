import React, { useState, useEffect } from 'react'
import axios from 'axios'

import GameHistoryDiv from './GameHistoryDiv'
import { StyledLoading } from '../styled/StyledLoading'

export default function History({ player, }) {

    const [getHistory, setGetHistory] = useState(false)
    const [history, setHistory] = useState(null)
    const [fetchingHistory, setFetchingHistory] = useState(null)

    useEffect(() => {
        let mounted = true
        if (getHistory) {

            setFetchingHistory(true)

            let arr = []
            const url =
                'https://coh2-api.reliclink.com/community/leaderboard/' +
                'getRecentMatchHistory?title=coh2&profile_ids=[' +
                player.profileId +
                ']'
            const fetch1 = axios.get(url)

            const url2 =
                'https://coh2-api.reliclink.com/' +
                'community/leaderboard/GetAvailableLeaderboards?title=coh2'
            const fetch2 = axios.get(url2)

            Promise.all([fetch1, fetch2])
                .then((result) => {
                    console.log('History fetch result:', result)

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
                            return r.profile_id.toString() === player.profileId
                        })
                        mObj.counters = mObj.result.counters
                        arr.push(mObj)
                    })

                    let objProfiles = {}
                    profiles.forEach((p) => (objProfiles[p.profile_id] = p))

                    if (mounted) {
                        setHistory({
                            matchHistoryStats: arr,
                            profiles: objProfiles,
                        })
                    }
                })
                .catch((error) => {
                    if (error) {
                        console.log('error get history: ', error)
                    }
                })
        }

        return () => {
            mounted = false
        }
    }, [getHistory])

    const historyDivs =
        history &&
        history.matchHistoryStats.map((m, i) => {
            return <GameHistoryDiv
                key={i}
                game={m}
                profiles={history.profiles}
            />
        })

    const fetchDiv = <div
        style={{
            display: 'flex',
            justifyContent: 'center',
        }}
    >
        {fetchingHistory
            ? <StyledLoading />
            : <span
                style={{
                    // fontWeight: 'bold',
                    cursor: 'pointer',
                    border: '.05em solid #ddd',
                    padding: '0.2em .6em',
                }}
                onClick={() => setGetHistory(true)}
            >fetch history</span>
        }
    </div>

    return <>
        {history
            ? <div
                style={{
                    margin: '1em 0',
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {historyDivs}
            </div>
            : fetchDiv
        }
    </>
}
