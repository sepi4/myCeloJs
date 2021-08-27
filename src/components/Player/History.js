import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useSelector } from 'react-redux'
import getText from '../../functions/getText'

import GameHistoryDiv from './GameHistoryDiv'
import Loading from './Loading'

import styles from './History.module.css'

export default function History({ player, }) {
    const settings = useSelector(state => state.settings)

    const [getHistory, setGetHistory] = useState(false)
    const [history, setHistory] = useState(null)
    const [fetchingHistory, setFetchingHistory] = useState(null)

    useEffect(() => {
        let mounted = true
        if (getHistory) {
            setFetchingHistory(true)

            const url = 'https://coh2-api.reliclink.com/community/leaderboard/'
                + 'getRecentMatchHistory?title=coh2&profile_ids=['
                + player.profileId
                + ']'
            const url2 = 'https://coh2-api.reliclink.com/'
                + 'community/leaderboard/GetAvailableLeaderboards?title=coh2'

            const fetch1 = axios.get(url)
            const fetch2 = axios.get(url2)

            Promise.all([fetch1, fetch2])
                .then((result) => {
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
                            return r.profile_id.toString() === player.profileId
                        })

                        mObj.counters = mObj.result.counters
                        matchesArr.push(mObj)
                    })

                    let profilesObj = {}
                    profiles.forEach((p) => (profilesObj[p.profile_id] = p))

                    if (mounted) {
                        setHistory({
                            matchHistoryStats: matchesArr,
                            profiles: profilesObj,
                        })
                        setFetchingHistory(null)
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

    useEffect(() => {
        setHistory(null)
        setGetHistory(false)
    }, [player.profileId])

    const historyDivs =
        history &&
        history.matchHistoryStats.map((m, i) => {
            return <GameHistoryDiv
                key={i}
                game={m}
                profiles={history.profiles}
            />
        })

    const fetchDiv = <div className={styles.fetchDiv} >
        {fetchingHistory
            ? <Loading />
            : <span className={styles.getHistory}
                onClick={() => setGetHistory(true)}
            >{getText('fetch_history', settings)}</span>
        }
    </div>

    return <>
        {history
            ? <div className={styles.historyDivs} >
                {historyDivs}
            </div>
            : fetchDiv
        }
    </>
}
