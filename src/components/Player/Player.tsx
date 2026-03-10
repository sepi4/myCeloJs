import PlayerExtraInfo from './PlayerExtraInfo'
import PlayerMainRow from './PlayerMainRow'

import { ExtraInfo, Player as PlayerType } from '../../types'
import { useOpenInfosStore } from '../../stores/openInfosStore'

interface Props {
    player: PlayerType
    extraInfo: ExtraInfo | null
    teamIndex: number
    playerIndex: number
}

function Player(props: Props) {
    const { player, extraInfo, teamIndex, playerIndex } = props

    const { openInfos, toggleOpenInfo } = useOpenInfosStore()

    const handleSetShowExtra = () => {
        toggleOpenInfo(teamIndex, playerIndex)
    }

    const showExtra = openInfos[teamIndex][playerIndex]
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
