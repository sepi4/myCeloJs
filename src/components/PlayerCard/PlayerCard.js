
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PlayerExtraInfo from '../Player/PlayerExtraInfo'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, } from '@fortawesome/free-solid-svg-icons'

export default function PlayerCard() {
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    console.log(state)

    const handlePlayerCardOff = () => {
        dispatch({
            type: 'PLAYER_CARD_OFF',
        })
    }

    // console.log(
    //     state && state.playerCard && state.extraInfo
    // )
    // console.log(
    //     state.playerCard.player
    // )

    const player = state.playerCard.player
    let extraInfo = state.extraInfo

    extraInfo = extraInfo && player.profileId
        ? extraInfo[player.profileId]
        : null

    const card = (
        state && state.playerCard && state.extraInfo
            ? <PlayerExtraInfo
                player={player}
                extraInfo={extraInfo}
            />
            : null
    )

    return (
        <div>
            <div style={{
                background: '#181818',
                padding: '0.5em 1.5em',
                margin: '1em 0',
            }}>
                <div
                    style={{
                        width: '100%',
                        justifyContent: 'flex-end',
                        display: 'flex',
                    }}
                >
                    <FontAwesomeIcon
                        icon={faTimes}
                        size='2x'
                        color='#dddddd'
                        onClick={handlePlayerCardOff}
                        style={{
                            marginRight: '0.5em',
                            cursor: 'pointer',
                            // height: '5em',
                            // width: '5em',
                        }}
                    />
                </div>
                <h2 style={{
                    textAlign: 'center',
                    color: '#dddddd',
                }} >
                    Player Card
                </h2>
                {card}
            </div>

        </div>
    )
}
