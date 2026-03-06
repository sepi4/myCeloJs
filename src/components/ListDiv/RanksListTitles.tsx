import ColumnTitle from './ColumnTitle'
import getText from '../../functions/getText'

import styles from './ListDiv.module.css'

import { Rank } from '../../types'
import { useAppSelector } from '../../hooks/customReduxHooks'
import { useSorterStore } from '../../stores/sorterStore'

type SorterName = 'byRank' | 'byWinRate' | 'byStreak' | 'byName' | 'byTotal'

function RanksListTitles({ ranksArr }: { ranksArr: Rank[] }) {
    const state = useAppSelector((state) => state)
    const { sorter, setSorter } = useSorterStore()

    const settings = state.settings

    const getSorter = (name: SorterName) => {
        return {
            click: () => setSorter(name),
            active: sorter.name === name,
            reversed: sorter.reversed,
        }
    }

    return (
        <>
            {ranksArr.length > 0 && (
                <div className={`${styles.row} ${styles.title}`}>
                    <ColumnTitle {...getSorter('byRank')}>
                        {getText('rank', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...getSorter('byName')} width="40%">
                        {getText('mode', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...getSorter('byWinRate')}>
                        {getText('win', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...getSorter('byStreak')}>
                        {getText('streak', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...getSorter('byTotal')}>
                        {getText('total', settings)}
                    </ColumnTitle>
                </div>
            )}
        </>
    )
}

export default RanksListTitles
