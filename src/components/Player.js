import React from 'react'
import { useState } from 'react'

import PlayerExtraInfo from './PlayerExtraInfo'
import PlayerCurrentRank from './PlayerCurrentRank'

import { getFactionFlagLocation } from '../functions/getFactionFlagLocation'
import { commonName, } from '../functions/simpleFunctions'

function Player({ player, extraInfo, }) {
    
    const [showExtra, setShowExtra] = useState(false)

    const style = {
        width: '25%',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
    }

    const img = (
        <img
            style={{
                width: '2em',
                height: '2em',
            }}
            src={getFactionFlagLocation(commonName(player.faction))}
            alt={`${player.faction}`}
        />
    )

    const handleSetShowExtra = () => {
        setShowExtra(!showExtra)
    }

    return <div>
        <PlayerCurrentRank
            {...{
                style,
                player,
                img,
                handleSetShowExtra,
                showExtra,
                extraInfo,
            }}
        />
        {showExtra 
            ?  <PlayerExtraInfo
                {...{
                    style,
                    player,
                    img,
                    extraInfo,
                }}
            />
            : null
        }
    </div>
}

export default Player