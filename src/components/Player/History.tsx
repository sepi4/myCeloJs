import { faAngleDoubleDown, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../../constants/urls'
import getText from '../../functions/utils/getText'
import { parseHistoryData } from '../../functions/utils/parseMatchHistory'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { useSettingsStore } from '../../stores/settingsStore'
import { MatchObject, NormalizedProfiles, Player } from '../../types'
import GameHistoryDiv from './GameHistoryDiv'
import styles from './History.module.css'
import Loading from './Loading'

interface Props {
    player: Player
}
interface X {
    matchHistoryStats: MatchObject[]
    profiles: NormalizedProfiles
}

export default function History(props: Props) {
    const { settings } = useSettingsStore()
    const coh3 = useDisplayCoh3()

    // bumped on each fetch request so a failed fetch can be retried
    const [fetchRequest, setFetchRequest] = useState(0)
    const [history, setHistory] = useState<X | null>(null)
    const [fetching, setFetching] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    // index of the game whose details are shown, only one at a time
    const [openGame, setOpenGame] = useState<number | null>(null)

    useEffect(() => {
        let mounted = true
        if (fetchRequest > 0) {
            setFetching(true)
            async function fetchHistory() {
                try {
                    const id = props.player.profileId
                    const base = coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2
                    const title = coh3 ? 'coh3' : 'coh2'
                    const url = `${base}/getRecentMatchHistoryByProfileId?title=${title}&profile_id=${id}`
                    const url2 = `${base}/GetAvailableLeaderboards?title=${title}`
                    const [r1, r2] = await Promise.all([
                        fetch(url).then((r) => r.json()),
                        fetch(url2).then((r) => r.json()),
                    ])
                    if (mounted) {
                        setHistory(parseHistoryData([r1, r2], props.player))
                        setOpenGame(null)
                        setFetching(false)
                    }
                } catch (error) {
                    console.log('error get history:', error)
                    if (mounted) {
                        setFetching(false)
                        setHistoryOpen(false)
                    }
                }
            }
            fetchHistory()
        }

        return () => {
            mounted = false
        }
    }, [fetchRequest, props.player, coh3])

    useEffect(() => {
        setHistory(null)
        setFetchRequest(0)
        setFetching(false)
        setHistoryOpen(false)
        setOpenGame(null)
    }, [props.player.profileId])

    const handleToggle = () => {
        if (fetching) {
            return
        }
        if (!history) {
            setFetchRequest((n) => n + 1)
        }
        setHistoryOpen(!historyOpen)
    }

    return (
        <>
            <div className={styles.fetchDiv}>
                <button
                    data-testid="history-toggle"
                    className={styles.toggle}
                    onClick={handleToggle}
                >
                    <FontAwesomeIcon icon={historyOpen ? faAngleDoubleDown : faAngleDoubleRight} />
                    {getText('game_history', settings)}
                </button>
            </div>

            {fetching && (
                <div className={`${styles.fetchDiv} ${styles.loading}`}>
                    <Loading />
                </div>
            )}

            {history && historyOpen && (
                <div data-testid="game-history" className={styles.historyDivs}>
                    {history.matchHistoryStats.map((m, i) => {
                        return (
                            <GameHistoryDiv
                                key={i}
                                game={m}
                                profiles={history.profiles}
                                coh3={coh3}
                                open={openGame === i}
                                onToggle={() => setOpenGame(openGame === i ? null : i)}
                            />
                        )
                    })}
                </div>
            )}
        </>
    )
}
