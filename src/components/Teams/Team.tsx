import React from 'react'
import { useAppSelector } from '../../hooks/customReduxHooks'
import { NormalizedExtraInfo, Player as PlayerType } from '../../types'

import Player from '../Player/Player'

interface Props {
    players: PlayerType[]
    teamIndex: number
}

function Team(props: Props) {
    const extraInfo: NormalizedExtraInfo = useAppSelector(
        (state) => state.extraInfo
    )
    return (
        <div
            style={{
                background: '#181818',
                padding: '0.5em 1.5em',
                margin: '1em 0',
            }}
        >
            {props.players.map((p, i) => (
                <Player
                    key={p.profileId ? p.profileId : i}
                    player={p}
                    extraInfo={
                        extraInfo && p.profileId ? extraInfo[p.profileId] : null
                    }
                    playerIndex={i}
                    teamIndex={props.teamIndex}
                />
            ))}
        </div>
    )
}

export default Team
