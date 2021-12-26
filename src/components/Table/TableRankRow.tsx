import React from 'react'
import styles from './TableRankRow.module.css'

interface Props {
    rank: number | string
    num: number
    per: string
    streak: number | string
    totalGames: number | string
}

function TableRankRow({ rank, num, per, streak, totalGames }: Props) {
    // prettier-ignore
    const color = (
        Number(streak)
            ? streak > 0
                ? 'green'
                : 'red'
            : '#ddd'
    )

    streak = streak > 0 ? '+' + streak : streak

    return (
        <div className={styles.container}>
            <span> {rank} </span>
            <span>
                {' '}
                {num}v{num}{' '}
            </span>
            <span> {per} </span>
            <span style={{ color }}> {streak} </span>
            <span> {totalGames} </span>
        </div>
    )
}

export default TableRankRow
