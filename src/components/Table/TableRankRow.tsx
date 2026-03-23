import getText from '../../functions/utils/getText'
import { useSettingsStore } from '../../stores/settingsStore'
import styles from './TableRankRow.module.css'

interface Props {
    rank: number | string
    num: number
    per: string
    streak: number | string
    totalGames: number | string
    ranktotal: number | string
    rating?: number | string
}

function TableRankRow({ rank, num, per, streak, totalGames, ranktotal, rating }: Props) {
    const { settings } = useSettingsStore()
    // prettier-ignore
    const color = (
        Number(streak)
            ? Number(streak) > 0
                ? 'green'
                : 'red'
            : '#ddd'
    )

    streak = Number(streak) > 0 ? '+' + streak : streak
    ranktotal =
        Number(ranktotal) > 0 || ranktotal === '?' ? `${getText('of', settings)} ${ranktotal}` : ''
    return (
        <div className={styles.container}>
            <span title={ranktotal}> {rank} </span>
            <span>
                {num}v{num}
            </span>
            {rating !== undefined && <span>{rating !== '-' ? `(${rating})` : '-'}</span>}
            <span style={{ color }}> {streak} </span>
            <span>{per} </span>
            <span> {totalGames} </span>
        </div>
    )
}

export default TableRankRow
