import { faAngleDoubleDown, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

import { ranksArrFilter, ranksArrSort } from '../../functions/rankings/ranksArrFuns'
import getText from '../../functions/utils/getText'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSorterStore } from '../../stores/sorterStore'
import { Rank } from '../../types'
import Cell from './Cell'
import styles from './ListDiv.module.css'
import RanksList from './RanksList'
import RanksListTitles from './RanksListTitles'

function ListDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const {
        navButtons: { table: tableView, all: showAll },
    } = useNavButtonsStore()
    const coh3 = useDisplayCoh3()
    const { sorter } = useSorterStore()
    const { settings } = useSettingsStore()

    const [allOpen, setAllOpen] = useState<boolean>(false)

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    // only team ranks with several members can be expanded
    const hasExpandable = ranksArr.some((r) => r.members && r.members.length > 1)

    return (
        ranksArr && (
            <div className={styles.container}>
                {!coh3 && hasExpandable && (
                    // same column widths as RanksList so the button sits above the row arrows
                    <div className={styles.row}>
                        <Cell />
                        <Cell width="40%" justifyContent="flex-start">
                            <button
                                data-testid="ranks-toggle-all"
                                className={styles.toggleAll}
                                onClick={() => setAllOpen(!allOpen)}
                            >
                                <FontAwesomeIcon
                                    icon={allOpen ? faAngleDoubleDown : faAngleDoubleRight}
                                />
                                {getText(
                                    allOpen ? 'collapse_all_team' : 'expand_all_team',
                                    settings
                                )}
                            </button>
                        </Cell>
                        <Cell />
                        <Cell />
                        <Cell />
                    </div>
                )}
                <RanksListTitles ranksArr={ranksArr} />
                <RanksList allOpen={allOpen} ranksArr={ranksArr} />
            </div>
        )
    )
}

export default ListDiv
