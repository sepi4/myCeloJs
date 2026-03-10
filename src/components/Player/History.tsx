import { useState, useEffect } from 'react'
import getText from '../../functions/getText'

import GameHistoryDiv from './GameHistoryDiv'
import Loading from './Loading'

import styles from './History.module.css'
import { parseHistoryData, getHistoryUrls } from '../../functions/historyFuns'
import { Player, MatchObject, NormalizedProfiles } from '../../types'
import { useSettingsStore } from '../../stores/settingsStore'

interface Props {
    player: Player
}
interface X {
    matchHistoryStats: MatchObject[]
    profiles: NormalizedProfiles
}

export default function History(props: Props) {
    const { settings } = useSettingsStore()

    const [getHistory, setGetHistory] = useState(false)
    const [history, setHistory] = useState<X | null>(null)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        let mounted = true
        if (getHistory) {
            setFetching(true)

            const [url, url2] = getHistoryUrls(props.player.profileId)
            const fetch1 = fetch(url).then((r) => r.json())
            const fetch2 = fetch(url2).then((r) => r.json())

            Promise.all([fetch1, fetch2])
                .then((result) => {
                    if (mounted) {
                        const x = parseHistoryData(result, props.player)
                        setHistory(x)
                        setFetching(false)
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
    }, [getHistory, props.player])

    useEffect(() => {
        setHistory(null)
        setGetHistory(false)
    }, [props.player.profileId])

    return (
        <>
            {history && (
                <div data-testid="game-history" className={styles.historyDivs}>
                    {history.matchHistoryStats.map((m, i) => {
                        return <GameHistoryDiv key={i} game={m} profiles={history.profiles} />
                    })}
                </div>
            )}

            {!history && (
                <div className={styles.fetchDiv}>
                    {fetching && <Loading />}

                    {!fetching && (
                        <span
                            data-testid="fetch-history"
                            className={styles.getHistory}
                            onClick={() => setGetHistory(true)}
                        >
                            {getText('fetch_history', settings)}
                        </span>
                    )}
                </div>
            )}
        </>
    )
}
