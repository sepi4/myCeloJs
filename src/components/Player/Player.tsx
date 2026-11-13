import { useOpenPlayerDetailsStore } from '../../stores/openPlayerDetailsStore'
import { PlayerRanks, Player as PlayerType } from '../../types'
import PlayerDetails from './PlayerDetails'
import PlayerMainRow from './PlayerMainRow'

interface Props {
    player: PlayerType
    playerRanks: PlayerRanks | null
}

function Player(props: Props) {
    const { player, playerRanks } = props

    const { openPlayers, toggleOpenPlayer } = useOpenPlayerDetailsStore()

    const handleSetShowExtra = () => {
        if (player.profileId) {
            toggleOpenPlayer(player.profileId)
        }
    }

    const showExtra = player.profileId !== undefined && openPlayers.includes(player.profileId)
    return (
        <div>
            <PlayerMainRow
                {...{
                    player,
                    handleSetShowExtra,
                    playerRanks,
                    showExtra,
                }}
            />
            {showExtra && playerRanks && (
                <PlayerDetails player={player} playerRanks={playerRanks} />
            )}
        </div>
    )
}

export default Player
