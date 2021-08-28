import React from 'react'

import styles from './TableRankRow.module.css'

function TableRankRow({ rank, num, per, streak, totalGames }) {

    const color = (
        Number(streak)
            ? streak > 0
                ? 'green'
                : 'red'
            : '#ddd'
    )

    streak = streak > 0
        ? '+' + streak
        : streak

    return <div className={styles.container} >
        <span> {rank} </span>
        <span> {num}v{num} </span>
        <span> {per} </span>
        <span style={{ color }}> {streak} </span>
        <span> {totalGames} </span>
    </div>
}

export default TableRankRow