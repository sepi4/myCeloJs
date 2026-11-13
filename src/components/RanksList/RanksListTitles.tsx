import { GAME_CONFIG } from '../../constants/games'
import { SorterName } from '../../functions/rankings/sorters'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useText from '../../hooks/useText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSorterStore } from '../../stores/sorterStore'
import { Rank } from '../../types'
import ColumnTitle from './ColumnTitle'

import styles from './RanksList.module.css'

function RanksListTitles({ ranksArr }: { ranksArr: Rank[] }) {
    const getText = useText()
    const { sorter, setSorter } = useSorterStore()
    const {
        navButtons: { elo },
    } = useNavButtonsStore()
    const showElo = GAME_CONFIG[useDisplayGame()].hasElo && elo

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
                    <ColumnTitle {...getSorter('byRank')}>{getText('rank')}</ColumnTitle>
                    <ColumnTitle {...getSorter('byName')} width="40%">
                        {getText('mode')}
                    </ColumnTitle>
                    {showElo && <ColumnTitle {...getSorter('byRating')}>ELO</ColumnTitle>}
                    <ColumnTitle {...getSorter('byStreak')}>{getText('streak')}</ColumnTitle>
                    <ColumnTitle {...getSorter('byWinRate')}>{getText('win')}</ColumnTitle>
                    <ColumnTitle {...getSorter('byTotal')}>{getText('total')}</ColumnTitle>
                </div>
            )}
        </>
    )
}

export default RanksListTitles
