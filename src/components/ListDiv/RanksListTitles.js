import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ColumnTitle from './ColumnTitle'
import { byRank, byWinRate, byStreak, byName, byTotal, }
    from '../../functions/sorters'
import getText from '../../functions/getText'

import styles from './ListDiv.module.css'

function RanksListTitles({ ranksArr }) {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const settings = state.settings
    const sorter = state.sorter

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

    return <>
        {ranksArr.length > 0 &&
            <div className={`${styles.row} ${styles.title}`} >
                <ColumnTitle
                    {...setSorter(byRank, 'byRank')}
                >{getText('rank', settings)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byName, 'byName')}
                    width='40%'
                >{getText('mode', settings)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byWinRate, 'byWinRate')}
                >{getText('win', settings)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byStreak, 'byStreak')}
                >{getText('streak', settings)}</ColumnTitle>
                <ColumnTitle
                    {...setSorter(byTotal, 'byTotal')}
                >{getText('total', settings)}</ColumnTitle>
            </div>
        }
    </>
}

export default RanksListTitles