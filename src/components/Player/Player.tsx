import PlayerExtraInfo from './PlayerExtraInfo'
import PlayerMainRow from './PlayerMainRow'

import { ExtraInfo, Player as PlayerType } from '../../types'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'

interface Props {
    player: PlayerType
    extraInfo: ExtraInfo | null
    teamIndex: number
    playerIndex: number
}

function Player(props: Props) {
    const { player, extraInfo, teamIndex, playerIndex } = props

    const dispatch = useAppDispatch()
    const openInfos = useAppSelector((state) => state.openInfos)

    const handleSetShowExtra = () => {
        dispatch({
            type: 'TOGGLE_EXTRA',
            data: {
                teamIndex,
                playerIndex,
            },
        })
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
            {showExtra && extraInfo && (
                <PlayerExtraInfo player={player} extraInfo={extraInfo} />
            )}
        </div>
    )
}

export default Player
