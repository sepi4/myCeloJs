import React from 'react'

function TableRankRow({ rank, num, per, streak, totalGames }) {
    const s = {
        display: 'flex',
        justifyContent: 'center',
        width: '20%',
    }

    const color = Number(streak)
        ? streak > 0
            ? 'green'
            : 'red'
        : '#ddd'

    streak = streak > 0
        ? '+' + streak
        : streak

    return <div style={{ display: 'flex' }} >
        <span style={s}>{rank}</span>
        <span style={s}>{num}v{num}</span>
        <span style={s}>{per}</span>
        <span style={{ ...s, color }}>{streak}</span>
        <span style={s}>{totalGames}</span>
    </div>
}

export default TableRankRow