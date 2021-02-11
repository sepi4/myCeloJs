import React from 'react'
import TableRankRow from './TableRankRow'
import FactionIcon from './FactionIcon'


function TableRanksDiv({solo, index, name}) {
    return <>
            <FactionIcon 
                faction={name} 
                size='2.2em'
            />

            <div
                style={{
                    gridColumn: '2 / 7',
                }}
            >
                {[0, 1, 2, 3].map((x, i) => {
                    let d = x + 1
                    let r = solo[index]
                    index++
                    let per = '-'
                    let totalGames = 0
                    let rank = '-'
                    let streak = '-'
                    if (r) {
                        per = r.wins / (r.wins + r.losses) * 100
                        per = per.toFixed(0) + '%'
                        totalGames = r.wins + r.losses
                        if (r.rank > 0) {
                            rank = r.rank
                        }
                        streak = r.streak
                    }

                    return <TableRankRow
                        key={x + i + 'rank'}
                        {...{rank, d, per, streak, totalGames}}
                    />
                })}
            </div>
    </>
}

export default TableRanksDiv