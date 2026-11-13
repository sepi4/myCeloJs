import { getTotalWinsAndLosses } from '../../functions/rankings/totalGames'
import useText from '../../hooks/useText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { PlayerRanks, GameHistoryState, Player } from '../../types'
import RanksList from '../RanksList/RanksList'
import RanksTable from '../RanksTable/RanksTable'
import GameHistory from './GameHistory'

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

    const table = navButtons.table && ranksArr ? <RanksTable ranks={ranksArr} /> : null

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
