import React from 'react'

import { ranksArrSort, ranksArrFilter } from '../../functions/ranksArrFuns'

import styles from './ListDiv.module.css'
import RanksList from './RanksList'
import RanksListTitles from './RanksListTitles'

import { Rank } from '../../types'

import { useAppSelector } from '../../hooks/customReduxHooks'

function ListDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const state = useAppSelector((state) => state)
    const tableView = state.navButtons.table
    const showAll = state.navButtons.all
    const sorter = state.sorter

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    return (
        ranksArr && (
            <div className={styles.container}>
                <RanksListTitles ranksArr={ranksArr} />
                <RanksList ranksArr={ranksArr} />
            </div>
        )
    )
}

export default ListDiv
