import React from 'react'

import TableRankRow from './TableRankRow'
import FactionIcon from './FactionIcon'
import { FactionName, Rank } from '../../types'

interface Props {
    solo: (Rank | undefined)[]
    index: number
    name: FactionName
}

function TableRanksDiv({ solo, index, name }: Props) {
    const rows = [0, 1, 2, 3].map((x, i) => {
        const num = x + 1
        const r = solo[index]
        index++
        let per = '-'
        let totalGames = 0
        let rank: number | string = '-'
        let streak: number | string = '-'
        let ranktotal = r?.ranktotal ?? '?'
        if (r) {
            const x = (r.wins / (r.wins + r.losses)) * 100
            per = x.toFixed(0) + '%'
            totalGames = r.wins + r.losses
            if (r.rank > 0) {
                rank = r.rank
            }
            streak = r.streak
        }
        return (
            <TableRankRow
                key={x + i + 'rank'}
                {...{ rank, num, per, streak, totalGames, ranktotal }}
            />
        )
    })

    return (
        <>
            <FactionIcon faction={name} size="2.2em" />
            <div style={{ gridColumn: '2 / 7' }}>{rows}</div>
        </>
    )
}

export default TableRanksDiv
