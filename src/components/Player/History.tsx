import { useCallback, useEffect, useState } from 'react'

import { fetchMatchHistory } from '../../functions/api/fetchMatchHistory'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useText from '../../hooks/useText'
import { HISTORY_PERIODS, isInPeriod, useHistoryPeriodStore } from '../../stores/historyPeriodStore'
import { EMPTY_GAME_HISTORY } from '../../stores/playerCardStore'
import { GameHistoryState, Player } from '../../types'
import { faCaretDown, faCaretRight } from '../icons'
import SvgIcon from '../SvgIcon'
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
    const getText = useText()
    const game = useDisplayGame()
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
                    const data = await fetchMatchHistory(game, props.player)
                    if (mounted) {
                        updateState({ data, openGame: null })
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
    }, [fetching, props.player, game, updateState])

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
                    <SvgIcon icon={historyOpen ? faCaretDown : faCaretRight} size="lg" />
                    {getText('game_history')}
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
                                {getText(`period_${period}`)}
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
                                open={openGame === id}
                                onToggle={() =>
                                    updateState({ openGame: openGame === id ? null : id })
                                }
                            />
                        )
                    })}
                    {games.length === 0 && (
                        <div data-testid="history-empty" className={styles.empty}>
                            {getText('no_games_in_period')}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
