import ColumnTitle from './ColumnTitle'
import getText from '../../functions/getText'

import styles from './ListDiv.module.css'

import { Rank } from '../../types'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'

function RanksListTitles({ ranksArr }: { ranksArr: Rank[] }) {
    const state = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    const settings = state.settings
    const sorter = state.sorter

    const setSorter = (name: string) => {
        return {
            click: () => {
                dispatch({
                    type: 'SET_SORTER',
                    data: {
                        name,
                    },
                })
            },
            active: sorter.name === name,
            reversed: sorter.reversed,
        }
    }

    return (
        <>
            {ranksArr.length > 0 && (
                <div className={`${styles.row} ${styles.title}`}>
                    <ColumnTitle {...setSorter('byRank')}>
                        {getText('rank', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...setSorter('byName')} width="40%">
                        {getText('mode', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...setSorter('byWinRate')}>
                        {getText('win', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...setSorter('byStreak')}>
                        {getText('streak', settings)}
                    </ColumnTitle>
                    <ColumnTitle {...setSorter('byTotal')}>
                        {getText('total', settings)}
                    </ColumnTitle>
                </div>
            )}
        </>
    )
}

export default RanksListTitles
