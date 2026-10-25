import getText from '../../functions/utils/getText'
import { useSettingsStore } from '../../stores/settingsStore'
import styles from './TableRankRow.module.css'

interface Props {
    rank: number | string
    teamSize: number
    winPercent: string
    streak: number | string
    totalGames: number | string
    totalTitle?: string
    rankTotal: number
    rating?: number | string
}

function TableRankRow({
    rank,
    teamSize,
    winPercent,
    streak,
    totalGames,
    totalTitle,
    rankTotal,
    rating,
}: Props) {
    const { settings } = useSettingsStore()
    // prettier-ignore
    const streakColor = (
        Number(streak)
            ? Number(streak) > 0
                ? 'var(--accent-positive)'
                : 'var(--accent-negative)'
            : 'var(--text-primary)'
    )

    const streakDisplay = Number(streak) > 0 ? '+' + streak : streak
    const rankTitle =
        typeof rank === 'number' && rankTotal > 0
            ? `${rank} ${getText('of', settings)} ${rankTotal}`
            : undefined
    return (
        <div className={styles.container}>
            <span title={rankTitle}> {rank} </span>
            <span>
                {teamSize}v{teamSize}
            </span>
            {rating !== undefined && <span>{rating !== '-' ? `(${rating})` : '-'}</span>}
            <span style={{ color: streakColor }}> {streakDisplay} </span>
            <span>{winPercent} </span>
            <span title={totalTitle}> {totalGames} </span>
        </div>
    )
}

export default TableRankRow
