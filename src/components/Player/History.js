import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useSelector } from 'react-redux'
import getText from '../../functions/getText'

import GameHistoryDiv from './GameHistoryDiv'
import Loading from './Loading'

import styles from './History.module.css'
import { parseHistoryData, getHistoryUrls } from '../../functions/historyFuns'

export default function History({ player, }) {
    const settings = useSelector(state => state.settings)

    const [getHistory, setGetHistory] = useState(false)
    const [history, setHistory] = useState(null)
    const [fetchingHistory, setFetchingHistory] = useState(null)

    useEffect(() => {
        let mounted = true
        if (getHistory) {
            setFetchingHistory(true)

            const [url, url2] = getHistoryUrls(player.profileId)
            const fetch1 = axios.get(url)
            const fetch2 = axios.get(url2)

            Promise.all([fetch1, fetch2])
                .then((result) => {
                    if (mounted) {
                        setHistory(parseHistoryData(result, player))
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

    const historyDivs = history
        ? (
            <div className={styles.historyDivs} > {
                history.matchHistoryStats.map((m, i) => {
                    return <GameHistoryDiv
                        key={i}
                        game={m}
                        profiles={history.profiles}
                    />
                })
            }
            </div>
        )
        : null

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
            ? historyDivs
            : fetchDiv
        }
    </>
}
