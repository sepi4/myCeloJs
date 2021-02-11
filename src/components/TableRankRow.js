import React from 'react'

function TableRankRow({rank, d, per, streak, totalGames}) {
    const s = {
        display: 'flex',
        justifyContent: 'center',
        width: '20%',
    }

    return <div 
        style={{
            display: 'flex',
        }}
    >
        <span style={s}>{rank}</span>
        <span style={s}>{d}v{d}</span>
        <span style={s}>{per}</span>
        <span style={{
            ...s,
            color: Number(streak)
                ? streak > 0
                    ? 'green'
                    : 'red'
                : 'white',
        }}>
            {streak > 0
                ? '+' + streak
                : streak
            }
        </span>
        <span style={s}>{totalGames}</span>
    </div>
}

export default TableRankRow