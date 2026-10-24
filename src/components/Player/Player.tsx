import { useOpenInfosStore } from '../../stores/openInfosStore'
import { ExtraInfo, Player as PlayerType } from '../../types'
import PlayerExtraInfo from './PlayerExtraInfo'
import PlayerMainRow from './PlayerMainRow'

interface Props {
    player: PlayerType
    extraInfo: ExtraInfo | null
}

function Player(props: Props) {
    const { player, extraInfo } = props

    const { openInfos, toggleOpenInfo } = useOpenInfosStore()

    const handleSetShowExtra = () => {
        if (player.profileId) {
            toggleOpenInfo(player.profileId)
        }
    }

    const showExtra = player.profileId !== undefined && openInfos.includes(player.profileId)
    return (
        <div>
            <PlayerMainRow
                {...{
                    player,
                    handleSetShowExtra,
                    extraInfo,
                    showExtra,
                }}
            />
            {showExtra && extraInfo && <PlayerExtraInfo player={player} extraInfo={extraInfo} />}
        </div>
    )
}

export default Player
