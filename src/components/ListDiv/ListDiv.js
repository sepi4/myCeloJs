import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Rank from '../Player/Rank'
import Cell from './Cell'
import ColumnTitle from './ColumnTitle'

import { ranksArrSort, ranksArrFilter } from '../../functions/ranksArrFuns'
import {
    byRank,
    byWinRate,
    byStreak,
    byName,
    byTotal,
} from '../../functions/sorters'

import getText from '../../functions/getText'

function ListDiv({ ranksArr }) {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const settings = useSelector(state => state.settings)
    const lg = settings ? settings.language : null

    const tableView = state.navButtons.table
    const showAll = state.navButtons.all
    const sorter = state.sorter

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    const setSorter = (fun, name) => {
        return {
            click: () => {
                dispatch({
                    type: 'SET_SORTER',
                    data: {
                        fun,
                        name,
                    },
                })
            },
            active: sorter.name === name,
            reversed: sorter.reversed,
        }
    }

    const row = {
        fontSize: '90%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    return ranksArr && <div style={{
        fontSize: '90%',
        marginBottom: '1.2em',
    }}>
        {/* // titles */}
        {ranksArr.length > 0 &&
            <div
                style={{
                    ...row,
                    fontStyle: 'italic',
                    fontSize: '80%',
                    marginBottom: '.6em',
                    color: 'gray',
                }}
            >
                <ColumnTitle
                    {...setSorter(byRank, 'byRank')}
                >{getText('rank', lg)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byName, 'byName')}
                    width='40%'
                >{getText('mode', lg)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byWinRate, 'byWinRate')}
                >{getText('win', lg)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byStreak, 'byStreak')}
                >{getText('streak', lg)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byTotal, 'byTotal')}
                >{getText('total', lg)}</ColumnTitle>
            </div>
        }

        {/* // list of ranks */}
        {ranksArr
            .map((r, i) => {
                let per = r.wins / (r.wins + r.losses) * 100
                per = per.toFixed(0) + '%'
                const totalGames = r.wins + r.losses
                const rank = r.rank <= 0 ? '-' : r.rank
                const pos = r.streak > 0
                const streak = pos
                    ? `+${r.streak}`
                    : `${r.streak}`

                return <div style={row} key={i}>
                    <Cell title={rank + ' of ' + r.ranktotal} >{rank}</Cell>
                    <Cell width='40%' >
                        <Rank rank={r} />
                    </Cell>
                    <Cell color={'#FFFF66'} >{per}</Cell>
                    <Cell color={pos ? 'green' : 'red'}>{streak}</Cell>
                    <Cell>{totalGames}</Cell>
                </div>
            })
        }
    </div>

}

export default ListDiv