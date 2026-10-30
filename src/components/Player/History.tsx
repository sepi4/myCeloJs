import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'

import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../../constants/urls'
import getText from '../../functions/utils/getText'
import { parseHistoryData } from '../../functions/utils/parseMatchHistory'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { HISTORY_PERIODS, isInPeriod, useHistoryPeriodStore } from '../../stores/historyPeriodStore'
import { EMPTY_GAME_HISTORY } from '../../stores/playerCardStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { GameHistoryState, Player } from '../../types'
import GameHistoryDiv from './GameHistoryDiv'
import Loading from './Loading'

import styles from './History.module.css'

interface Props {
    player: Player
    /**
     * Keeps the state outside the component, so the player card can restore it
     * when moving back and forward. Without these the state is local.
     */
    state?: GameHistoryState
    updateState?: (patch: Partial<GameHistoryState>) => void
}

export default function History(props: Props) {
    const { settings } = useSettingsStore()
    const coh3 = useDisplayCoh3()
    const { historyPeriod, setHistoryPeriod } = useHistoryPeriodStore()

    const [localState, setLocalState] = useState<GameHistoryState>(EMPTY_GAME_HISTORY)
    const controlled = props.state !== undefined
    const state = props.state ?? localState
    const externalUpdate = props.updateState
    const updateState = useCallback(
        (patch: Partial<GameHistoryState>) =>
            externalUpdate ? externalUpdate(patch) : setLocalState((s) => ({ ...s, ...patch })),
        [externalUpdate]
    )
    const history = state.data
    const historyOpen = state.open
    // match id of the game whose details are shown, only one at a time
    const openGame = state.openGame
    // an open list without games is waiting for them
    const fetching = historyOpen && !history

    useEffect(() => {
        let mounted = true
        if (fetching) {
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
                        updateState({
                            data: parseHistoryData([r1, r2], props.player),
                            openGame: null,
                        })
                    }
                } catch (error) {
                    console.log('error get history:', error)
                    if (mounted) {
                        updateState({ open: false })
                    }
                }
            }
            fetchHistory()
        }

        return () => {
            mounted = false
        }
    }, [fetching, props.player, coh3, updateState])

    // The player card resets its own state when the player changes.
    useEffect(() => {
        if (!controlled) {
            setLocalState(EMPTY_GAME_HISTORY)
        }
        // oxlint-disable-next-line react/exhaustive-effect-dependencies
    }, [props.player.profileId, controlled])

    const handleToggle = () => {
        if (fetching) {
            return
        }
        updateState({ open: !historyOpen })
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
                    <FontAwesomeIcon icon={historyOpen ? faCaretDown : faCaretRight} size="lg" />
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
                                onToggle={() =>
                                    updateState({ openGame: openGame === id ? null : id })
                                }
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
