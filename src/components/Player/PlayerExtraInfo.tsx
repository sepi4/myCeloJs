import getText from '../../functions/utils/getText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
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
    let ranksArr = props.extraInfo?.ranks ?? []
    const { settings } = useSettingsStore()
    const { navButtons } = useNavButtonsStore()

    const totalGames = (() => {
        if (!navButtons.total) {
            return null
        }
        let wins = 0
        let losses = 0
        for (const rankObj of ranksArr) {
            if (rankObj?.isModeRanked === 1) {
                wins += rankObj.wins
                losses += rankObj.losses
            }
        }
        return (
            <div data-testid="total-games" className={styles.total}>
                <span title={`${wins} / ${losses}`}>
                    {getText('total_games', settings)}: {wins + losses}
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
