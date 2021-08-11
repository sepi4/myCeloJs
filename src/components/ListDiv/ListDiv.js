import React from 'react'
import { useSelector } from 'react-redux'

import { ranksArrSort, ranksArrFilter } from '../../functions/ranksArrFuns'

import styles from './ListDiv.module.css'
import RanksList from './RanksList'
import RanksListTitles from './RanksListTitles'

function ListDiv({ ranksArr }) {
    const state = useSelector(state => state)
    const tableView = state.navButtons.table
    const showAll = state.navButtons.all
    const sorter = state.sorter

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    return ranksArr && <div className={styles.container}     >
        <RanksListTitles ranksArr={ranksArr} />
        <RanksList ranksArr={ranksArr} />
    </div>
}

export default ListDiv