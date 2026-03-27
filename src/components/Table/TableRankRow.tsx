import getText from '../../functions/utils/getText'
import { useSettingsStore } from '../../stores/settingsStore'
import styles from './TableRankRow.module.css'

interface Props {
    rank: number | string
    teamSize: number
    winPercent: string
    streak: number | string
    totalGames: number | string
    rankTotal: number | string
    rating?: number | string
}

function TableRankRow({
    rank,
    teamSize,
    winPercent,
    streak,
    totalGames,
    rankTotal,
    rating,
}: Props) {
    const { settings } = useSettingsStore()
    // prettier-ignore
    const streakColor = (
        Number(streak)
            ? Number(streak) > 0
                ? 'green'
                : 'red'
            : '#ddd'
    )

    const streakDisplay = Number(streak) > 0 ? '+' + streak : streak
    const rankTotalDisplay =
        Number(rankTotal) > 0 || rankTotal === '?' ? `${getText('of', settings)} ${rankTotal}` : ''
    return (
        <div className={styles.container}>
            <span title={rankTotalDisplay}> {rank} </span>
            <span>
                {teamSize}v{teamSize}
            </span>
            {rating !== undefined && <span>{rating !== '-' ? `(${rating})` : '-'}</span>}
            <span style={{ color: streakColor }}> {streakDisplay} </span>
            <span>{winPercent} </span>
            <span> {totalGames} </span>
        </div>
    )
}

export default TableRankRow
