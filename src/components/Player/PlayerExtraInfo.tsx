import { getTotalWinsAndLosses } from '../../functions/rankings/simpleFunctions'
import useText from '../../hooks/useText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { ExtraInfo, GameHistoryState, Player } from '../../types'
import ListDiv from '../ListDiv/ListDiv'
import TableDiv from '../Table/TableDiv'
import History from './History'

import styles from './PlayerExtraInfo.module.css'

interface Props {
    player: Player
    extraInfo: ExtraInfo | null
    gameHistory?: GameHistoryState
    updateGameHistory?: (patch: Partial<GameHistoryState>) => void
}

function PlayerExtraInfo(props: Props) {
    const getText = useText()
    let ranksArr = props.extraInfo?.ranks ?? []
    const { navButtons } = useNavButtonsStore()

    const totalGames = (() => {
        if (!navButtons.total) {
            return null
        }
        const { wins, losses } = getTotalWinsAndLosses(ranksArr)
        return (
            <div data-testid="total-games" className={styles.total}>
                <span title={`${wins} / ${losses}`}>
                    {getText('total_games')}: {wins + losses}
                </span>
            </div>
        )
    })()

    ranksArr = ranksArr.filter((r) => r.isModeRanked === 1)

    const table = navButtons.table && ranksArr ? <TableDiv playerRanks={ranksArr} /> : null

    return (
        <div data-testid="player-extra-info" className={styles.container}>
            {totalGames}
            {table}
            <ListDiv ranksArr={ranksArr} />
            <History
                player={props.player}
                state={props.gameHistory}
                updateState={props.updateGameHistory}
            />
        </div>
    )
}

export default PlayerExtraInfo
