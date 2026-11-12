import { useState } from 'react'

import { filterRanks, sortRanks } from '../../functions/rankings/filterAndSortRanks'
import { anyKeyOpen, toggleKey, toggleKeys } from '../../functions/utils/openKeys'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useText from '../../hooks/useText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSorterStore } from '../../stores/sorterStore'
import { Rank } from '../../types'
import { faAngleDoubleDown, faAngleDoubleRight } from '../icons'
import SvgIcon from '../SvgIcon'
import Cell from './Cell'
import RanksList, { rankKey } from './RanksList'
import RanksListTitles from './RanksListTitles'

import styles from './ListDiv.module.css'

function ListDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const getText = useText()
    const {
        navButtons: { table: tableView, all: showAll },
    } = useNavButtonsStore()
    const game = useDisplayGame()
    const { sorter } = useSorterStore()

    // keys of the team ranks whose members are shown
    const [openRanks, setOpenRanks] = useState<string[]>([])

    ranksArr = filterRanks(ranksArr, tableView, showAll)
    ranksArr = sortRanks(ranksArr, sorter)

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
                {game === 'coh2' && hasExpandable && (
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
                                {getText(allOpen ? 'collapse_all_team' : 'expand_all_team')}
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
