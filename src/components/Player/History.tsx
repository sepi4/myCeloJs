import { faAngleDoubleDown, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../../constants/urls'
import getText from '../../functions/utils/getText'
import { parseHistoryData } from '../../functions/utils/parseMatchHistory'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { HISTORY_PERIODS, isInPeriod, useHistoryPeriodStore } from '../../stores/historyPeriodStore'
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
    const { historyPeriod, setHistoryPeriod } = useHistoryPeriodStore()

    // bumped on each fetch request so a failed fetch can be retried
    const [fetchRequest, setFetchRequest] = useState(0)
    const [history, setHistory] = useState<X | null>(null)
    const [fetching, setFetching] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    // match id of the game whose details are shown, only one at a time
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

    const games = history
        ? history.matchHistoryStats.filter((m) => isInPeriod(m.endGameTime, historyPeriod))
        : []

    return (
        <>
            <div className={styles.header}>
                <button
                    data-testid="history-toggle"
                    className={styles.toggle}
                    onClick={handleToggle}
                >
                    <FontAwesomeIcon icon={historyOpen ? faAngleDoubleDown : faAngleDoubleRight} />
                    {getText('game_history', settings)}
                </button>
                {history && historyOpen && (
                    <div className={styles.periods}>
                        {HISTORY_PERIODS.map((period) => (
                            <button
                                key={period}
                                data-testid={`history-period-${period}`}
                                aria-pressed={historyPeriod === period}
                                className={styles.period}
                                onClick={() => setHistoryPeriod(period)}
                            >
                                {getText(`period_${period}`, settings)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {fetching && (
                <div className={`${styles.fetchDiv} ${styles.loading}`}>
                    <Loading />
                </div>
            )}

            {history && historyOpen && (
                <div data-testid="game-history" className={styles.historyDivs}>
                    {games.map((m) => {
                        const id = m.all.id
                        return (
                            <GameHistoryDiv
                                key={id}
                                game={m}
                                profiles={history.profiles}
                                coh3={coh3}
                                open={openGame === id}
                                onToggle={() => setOpenGame(openGame === id ? null : id)}
                            />
                        )
                    })}
                    {games.length === 0 && (
                        <div data-testid="history-empty" className={styles.empty}>
                            {getText('no_games_in_period', settings)}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
