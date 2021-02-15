import React from 'react'

import PlayerExtraInfo from './PlayerExtraInfo'
import PlayerMainRow from './PlayerMainRow'

import { useSelector, useDispatch } from 'react-redux'

function Player({ player, extraInfo, teamIndex, playerIndex }) {

    const dispatch = useDispatch()
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
        <PlayerMainRow
            {...{
                player,
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