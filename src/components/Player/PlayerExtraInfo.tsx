import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'
import History from './History'

import getText from '../../functions/getText'

import styles from './PlayerExtraInfo.module.css'

import { ExtraInfo, Player } from '../../types'
import { useAppSelector } from '../../hooks/customReduxHooks'
import { getTotalGames } from '../../functions/simpleFunctions'

interface Props {
    player: Player
    extraInfo: ExtraInfo | null
}

function PlayerExtraInfo(props: Props) {
    let ranksArr = props.extraInfo?.ranks ?? []
    const state = useAppSelector((state) => state)
    const navButtons = state.navButtons
    const settings = state.settings

    const totalGames = (() => {
        if (!navButtons.total) {
            return null
        }
        let sum = 0
        for (const rankObj of ranksArr) {
            if(rankObj?.isModeRanked === 1) {
                sum += rankObj.wins + rankObj.losses
            }
        }
        return (
            <div className={styles.total}>
                {getText('total_games', settings)}: {sum}
            </div>
        )
    })()

    ranksArr = ranksArr.filter((r) => r.isModeRanked === 1)

    const table =
        navButtons.table && ranksArr ? <TableDiv ranksArr={ranksArr} /> : null

    return (
        <div className={styles.container}>
            {totalGames}
            {table}
            <ListDiv ranksArr={ranksArr} />
            {!navButtons.coh3 && <History player={props.player} />}
        </div>
    )
}

export default PlayerExtraInfo
