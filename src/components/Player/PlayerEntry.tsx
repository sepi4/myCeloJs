import { useOpenPlayerDetailsStore } from '../../stores/openPlayerDetailsStore'
import { PlayerRanks, Player } from '../../types'
import PlayerDetails from './PlayerDetails'
import PlayerRow from './PlayerRow'

interface Props {
    player: Player
    playerRanks: PlayerRanks | null
}

function PlayerEntry(props: Props) {
    const { player, playerRanks } = props

    const { openPlayers, toggleOpenPlayer } = useOpenPlayerDetailsStore()

    const toggleDetails = () => {
        if (player.profileId) {
            toggleOpenPlayer(player.profileId)
        }
    }

    const showDetails = player.profileId !== undefined && openPlayers.includes(player.profileId)
    return (
        <div>
            <PlayerRow
                {...{
                    player,
                    toggleDetails,
                    playerRanks,
                    showDetails,
                }}
            />
            {showDetails && playerRanks && (
                <PlayerDetails player={player} playerRanks={playerRanks} />
            )}
        </div>
    )
}

export default PlayerEntry
