import React from 'react'
import { useSelector } from 'react-redux'

import Player from './Player'

function Team({ players }) {
    const extraInfo = useSelector(state => state.extraInfo)
    return <div style={{
        background: '#181818',
        padding: '0.5em 1.5em',
        margin: '1em 0',
    }} >
        {players.map((p, i) => (
            <Player
                key={p.profileId + i}
                player={p}
                extraInfo={extraInfo
                    && p.profileId ? extraInfo[p.profileId] : null}
            />
        ))}
    </div>
}

export default Team