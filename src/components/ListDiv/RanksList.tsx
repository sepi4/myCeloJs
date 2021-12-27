import React from 'react'
import { Rank as RankType } from '../../types'
import Rank from '../Player/Rank'
import Cell from './Cell'

import styles from './ListDiv.module.css'

interface Props {
    ranksArr: RankType[]
}

function RanksList(props: Props) {
    const { ranksArr } = props
    return (
        <div>
            {ranksArr.map((r, i) => {
                const per: string =
                    ((r.wins / (r.wins + r.losses)) * 100).toFixed(0) + '%'
                const totalGames = r.wins + r.losses
                const rank = r.rank <= 0 ? '-' : r.rank
                const positive = r.streak > 0
                const streak = positive ? `+${r.streak}` : `${r.streak}`

                return (
                    <div className={styles.row} key={i}>
                        <Cell title={rank + ' of ' + r.ranktotal}>{rank}</Cell>
                        <Cell width="40%">
                            <Rank rank={r} />
                        </Cell>
                        <Cell color={'#FFFF66'}>{per}</Cell>
                        <Cell color={positive ? 'green' : 'red'}>{streak}</Cell>
                        <Cell>{totalGames}</Cell>
                    </div>
                )
            })}
        </div>
    )
}

export default RanksList
