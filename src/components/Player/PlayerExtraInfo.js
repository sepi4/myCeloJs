import React from 'react'
import { useSelector } from 'react-redux'

import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'
import History from './History'

import getText from '../../functions/getText'

import styles from './PlayerExtraInfo.module.css'

function PlayerExtraInfo({ extraInfo, player }) {

    let ranksArr = extraInfo && extraInfo.ranks
    const state = useSelector(state => state)
    const navButtons = state.navButtons
    const settings = state.settings

    const totalGames = (() => {
        if (!navButtons.total) {
            return null
        }
        let sum = 0
        for (const rankObj of ranksArr) {
            sum += rankObj.wins + rankObj.losses
        }
        return (
            <div className={styles.total}>
                {getText('total_games', settings)}: {sum}
            </div>
        )
    })()

    ranksArr = ranksArr.filter(r => r.isModeRanked === 1)

    const table = navButtons.table && ranksArr
        ? <TableDiv ranksArr={ranksArr} />
        : null

    return <div className={styles.container}>
        {totalGames}
        {table}
        <ListDiv ranksArr={ranksArr} />
        <History player={player} />
    </div>
}

export default PlayerExtraInfo