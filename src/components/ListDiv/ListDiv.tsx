import { useState } from 'react'

import { ranksArrFilter, ranksArrSort } from '../../functions/rankings/ranksArrFuns'
import getText from '../../functions/utils/getText'
import { anyKeyOpen, toggleKey, toggleKeys } from '../../functions/utils/openKeys'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSorterStore } from '../../stores/sorterStore'
import { Rank } from '../../types'
import { faAngleDoubleDown, faAngleDoubleRight } from '../icons'
import SvgIcon from '../SvgIcon'
import Cell from './Cell'
import RanksList, { rankKey } from './RanksList'
import RanksListTitles from './RanksListTitles'

import styles from './ListDiv.module.css'

function ListDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const {
        navButtons: { table: tableView, all: showAll },
    } = useNavButtonsStore()
    const coh3 = useDisplayCoh3()
    const { sorter } = useSorterStore()
    const { settings } = useSettingsStore()

    // keys of the team ranks whose members are shown
    const [openRanks, setOpenRanks] = useState<string[]>([])

    ranksArr = ranksArrFilter(ranksArr, tableView, showAll)
    ranksArr = ranksArrSort(ranksArr, sorter)

    if (ranksArr && sorter.reversed) {
        ranksArr = ranksArr.reverse()
    }

    // only team ranks with several members can be expanded
    const expandableKeys = ranksArr.filter((r) => r.members && r.members.length > 1).map(rankKey)
    const hasExpandable = expandableKeys.length > 0
    const allOpen = anyKeyOpen(openRanks, expandableKeys)

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
                                aria-expanded={allOpen}
                                onClick={() => setOpenRanks(toggleKeys(openRanks, expandableKeys))}
                            >
                                <SvgIcon icon={allOpen ? faAngleDoubleDown : faAngleDoubleRight} />
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
                <RanksList
                    ranksArr={ranksArr}
                    openRanks={openRanks}
                    onToggleRank={(key) => setOpenRanks(toggleKey(openRanks, key))}
                />
            </div>
        )
    )
}

export default ListDiv
