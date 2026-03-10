import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

import getText from '../../functions/getText'
import { ranksArrFilter, ranksArrSort } from '../../functions/ranksArrFuns'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSorterStore } from '../../stores/sorterStore'
import { Rank } from '../../types'
import styles from './ListDiv.module.css'
import RanksList from './RanksList'
import RanksListTitles from './RanksListTitles'

function ListDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const {
        navButtons: { table: tableView, all: showAll, coh3 },
    } = useNavButtonsStore()
    const { sorter } = useSorterStore()
    const { settings } = useSettingsStore()

    const [allOpen, setAllOpen] = useState<boolean>(false)

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    return (
        ranksArr && (
            <div className={styles.container}>
                {!coh3 && (
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
                )}
                <RanksListTitles ranksArr={ranksArr} />
                <RanksList allOpen={allOpen} ranksArr={ranksArr} />
            </div>
        )
    )
}

export default ListDiv
