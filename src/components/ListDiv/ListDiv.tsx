import React, { useState } from 'react'

import { ranksArrSort, ranksArrFilter } from '../../functions/ranksArrFuns'

import styles from './ListDiv.module.css'
import RanksList from './RanksList'
import RanksListTitles from './RanksListTitles'
import { faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'

import { Rank } from '../../types'

import { useAppSelector } from '../../hooks/customReduxHooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import getText from '../../functions/getText'


function ListDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const state = useAppSelector((state) => state)
    const tableView = state.navButtons.table
    const showAll = state.navButtons.all
    const sorter = state.sorter
    const settings = state.settings

    const [allOpen, setAllOpen] = useState<boolean>(false)

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    return (
        ranksArr && (
            <div className={styles.container}>
                <div>
                    <FontAwesomeIcon
                        style={{
                            cursor: 'pointer',
                        }}
                        title={getText('expand_all', settings)}
                        icon={allOpen ? faMinus : faPlus}
                        onClick={() => setAllOpen(!allOpen)}
                    />
                </div>
                <RanksListTitles ranksArr={ranksArr} />
                <RanksList allOpen={allOpen} ranksArr={ranksArr} />
            </div>
        )
    )
}

export default ListDiv