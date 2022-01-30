import React from 'react'
import { Paper } from '@mui/material'
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
        <Paper elevation={3}>
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
        </Paper>
    )
}

export default Team
