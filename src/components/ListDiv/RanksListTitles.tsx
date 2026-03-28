import getText from '../../functions/utils/getText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSorterStore } from '../../stores/sorterStore'
import { Rank } from '../../types'
import ColumnTitle from './ColumnTitle'
import styles from './ListDiv.module.css'

type SorterName = 'byRank' | 'byWinRate' | 'byStreak' | 'byName' | 'byTotal' | 'byRating'

function RanksListTitles({ ranksArr }: { ranksArr: Rank[] }) {
    const { sorter, setSorter } = useSorterStore()
    const { settings } = useSettingsStore()
    const {
        navButtons: { coh3, elo },
    } = useNavButtonsStore()

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
                    <ColumnTitle {...getSorter('byRank')}>{getText('rank', settings)}</ColumnTitle>
                    <ColumnTitle {...getSorter('byName')} width="40%">
                        {getText('mode', settings)}
                    </ColumnTitle>
                    {coh3 && elo && <ColumnTitle {...getSorter('byRating')}>ELO</ColumnTitle>}
                    <ColumnTitle {...getSorter('byStreak')}>
                        {getText('streak', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...getSorter('byWinRate')}>
                        {getText('win', settings)}
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
