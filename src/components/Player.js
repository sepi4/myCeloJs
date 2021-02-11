import React from 'react'

import PlayerExtraInfo from './PlayerExtraInfo'
import PlayerCurrentRank from './PlayerCurrentRank'

import { getFactionFlagLocation } from '../functions/getFactionFlagLocation'
import { commonName, } from '../functions/simpleFunctions'
import { useSelector, useDispatch } from 'react-redux'

function Player({ player, extraInfo, teamIndex, playerIndex }) {

    const dispatch = useDispatch()

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

    const openInfos = useSelector(state => state.openInfos) 

    const handleSetShowExtra = () => {
        dispatch({ 
            type: 'TOGGLE_EXTRA',
            data: {
                teamIndex,
                playerIndex,
            }
        })
    }


    const showExtra = openInfos[teamIndex][playerIndex]
    return <div>
        <PlayerCurrentRank
            {...{
                player,
                img,
                handleSetShowExtra,
                extraInfo,
                showExtra,
            }}
        />
        {showExtra && extraInfo
            ?  <PlayerExtraInfo 
                extraInfo={extraInfo} 
            />
            : null
        }
    </div>
}

export default Player