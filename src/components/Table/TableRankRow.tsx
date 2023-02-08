import React from 'react'
import getText from '../../functions/getText'
import { useAppSelector } from '../../hooks/customReduxHooks'
import styles from './TableRankRow.module.css'

interface Props {
    rank: number | string
    num: number
    per: string
    streak: number | string
    totalGames: number | string
    ranktotal: number | string
}

function TableRankRow({ rank, num, per, streak, totalGames, ranktotal }: Props) {
    const settings = useAppSelector((state) => state.settings)
    // prettier-ignore
    const color = (
        Number(streak)
            ? streak > 0
                ? 'green'
                : 'red'
            : '#ddd'
    )

    streak = streak > 0 ? '+' + streak : streak
    ranktotal = rank > 0 && ranktotal > 0 ? `${getText('of', settings)} ${ranktotal}` : '' 
    return (
        <div className={styles.container}>
            <span title={ranktotal}> {rank} </span>
            <span>
                {num}v{num}
            </span>
            <span>{per} </span>
            <span style={{ color }}> {streak} </span>
            <span> {totalGames} </span>
        </div>
    )
}

export default TableRankRow
