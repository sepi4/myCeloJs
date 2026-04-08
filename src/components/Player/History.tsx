import { useEffect, useState } from 'react'

import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../../constants/urls'
import getText from '../../functions/utils/getText'
import { parseHistoryData } from '../../functions/utils/parseMatchHistory'
import { useSettingsStore } from '../../stores/settingsStore'
import { MatchObject, NormalizedProfiles, Player } from '../../types'
import GameHistoryDiv from './GameHistoryDiv'
import styles from './History.module.css'
import Loading from './Loading'

interface Props {
    player: Player
    coh3: boolean
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
            async function fetchHistory() {
                try {
                    const id = props.player.profileId
                    const base = props.coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2
                    const title = props.coh3 ? 'coh3' : 'coh2'
                    const url = `${base}/getRecentMatchHistoryByProfileId?title=${title}&profile_id=${id}`
                    const url2 = `${base}/GetAvailableLeaderboards?title=${title}`
                    const [r1, r2] = await Promise.all([
                        fetch(url).then((r) => r.json()),
                        fetch(url2).then((r) => r.json()),
                    ])
                    if (mounted) {
                        setHistory(parseHistoryData([r1, r2], props.player))
                        setFetching(false)
                    }
                } catch (error) {
                    console.log('error get history:', error)
                }
            }
            fetchHistory()
        }

        return () => {
            mounted = false
        }
    }, [getHistory, props.player, props.coh3])

    useEffect(() => {
        setHistory(null)
        setGetHistory(false)
    }, [props.player.profileId])

    return (
        <>
            {history && (
                <div data-testid="game-history" className={styles.historyDivs}>
                    {history.matchHistoryStats.map((m, i) => {
                        return (
                            <GameHistoryDiv
                                key={i}
                                game={m}
                                profiles={history.profiles}
                                coh3={props.coh3}
                            />
                        )
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
