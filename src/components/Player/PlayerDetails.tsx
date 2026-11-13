import { getTotalWinsAndLosses } from '../../functions/rankings/totalGames'
import useText from '../../hooks/useText'
import { useDisplayOptionsStore } from '../../stores/displayOptionsStore'
import { PlayerRanks, GameHistoryState, Player } from '../../types'
import GameHistory from '../GameHistory/GameHistory'
import RanksList from '../RanksList/RanksList'
import RanksTable from '../RanksTable/RanksTable'

import styles from './PlayerDetails.module.css'

interface Props {
    player: Pick<Player, 'profileId'>
    playerRanks: PlayerRanks | null
    gameHistory?: GameHistoryState
    updateGameHistory?: (patch: Partial<GameHistoryState>) => void
}

function PlayerDetails(props: Props) {
    const getText = useText()
    let ranksArr = props.playerRanks?.ranks ?? []
    const { displayOptions } = useDisplayOptionsStore()

    const totalGames = (() => {
        if (!displayOptions.showTotal) {
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

    const table = displayOptions.tableView && ranksArr ? <RanksTable ranks={ranksArr} /> : null

    return (
        <div data-testid="player-details" className={styles.container}>
            {totalGames}
            {table}
            <RanksList ranksArr={ranksArr} />
            <GameHistory
                player={props.player}
                state={props.gameHistory}
                updateState={props.updateGameHistory}
            />
        </div>
    )
}

export default PlayerDetails
