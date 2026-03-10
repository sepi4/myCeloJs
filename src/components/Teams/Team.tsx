import { Player as PlayerType } from '../../types'
import { useExtraInfoStore } from '../../stores/extraInfoStore'

import Player from '../Player/Player'

interface Props {
    players: PlayerType[]
    teamIndex: number
}

function Team(props: Props) {
    const { extraInfo } = useExtraInfoStore()
    return (
        <div
            data-testid="team-container"
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
                    extraInfo={extraInfo && p.profileId ? extraInfo[p.profileId] : null}
                    playerIndex={i}
                    teamIndex={props.teamIndex}
                />
            ))}
        </div>
    )
}

export default Team
