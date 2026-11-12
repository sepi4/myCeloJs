import { GAME_CONFIG } from '../../constants/games'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useText from '../../hooks/useText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { Rank as RankType } from '../../types'
import Rank from '../Player/Rank'
import Cell from './Cell'

import styles from './ListDiv.module.css'

/** Identifies a rank row: one team can have ranks in several leaderboards. */
export function rankKey(r: RankType): string {
    return `${r.statgroup_id}-${r.leaderboard_id}`
}

interface Props {
    ranksArr: RankType[]
    openRanks: string[]
    onToggleRank: (key: string) => void
}

function RanksList(props: Props) {
    const getText = useText()
    const {
        navButtons: { elo },
    } = useNavButtonsStore()
    const showElo = GAME_CONFIG[useDisplayGame()].hasElo && elo
    const { ranksArr } = props
    return (
        <div>
            {ranksArr.map((r, i) => {
                const winPercent = ((r.wins / (r.wins + r.losses)) * 100).toFixed(0) + '%'
                const totalGames = r.wins + r.losses
                const rank = r.rank <= 0 ? '-' : r.rank
                const positive = r.streak > 0
                const streak = positive ? `+${r.streak}` : `${r.streak}`

                return (
                    <div data-testid="rank-row" className={styles.row} key={i}>
                        <Cell
                            title={
                                r.rank > 0 && r.ranktotal > 0
                                    ? `${r.rank} ${getText('of')} ${r.ranktotal}`
                                    : undefined
                            }
                        >
                            {rank}
                        </Cell>
                        <Cell width="40%" justifyContent="flex-start">
                            <Rank
                                rank={r}
                                open={props.openRanks.includes(rankKey(r))}
                                onToggle={() => props.onToggleRank(rankKey(r))}
                            />
                        </Cell>
                        {showElo && <Cell>{r.rating ? `(${r.rating})` : '-'}</Cell>}
                        <Cell
                            color={positive ? 'var(--accent-positive)' : 'var(--accent-negative)'}
                        >
                            {streak}
                        </Cell>
                        <Cell>{winPercent}</Cell>
                        <Cell title={`${r.wins} / ${r.losses}`}>{totalGames}</Cell>
                    </div>
                )
            })}
        </div>
    )
}

export default RanksList
