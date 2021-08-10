import React, { useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'

import ModalDiv from './ModalDiv'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'

export default function GameHistoryDiv({ game, profiles }) {
    const [modal, setModal] = useState(false)
    const settings = useSelector(state => state.settings)
    const lg = settings && settings.language ? settings.language : 'en'

    let backgroundColor = 'blue'
    if (game.result.resulttype === 1) {
        backgroundColor = 'green'
    }
    if (game.result.resulttype === 0) {
        backgroundColor = 'red'
    }
    const players = game.players.sort((a, b) => b.teamid - a.teamid)

    const matchType = game.matchType ? game.matchType.name : '???'
    const timeAgo = moment(game.endGameTime).locale(lg).fromNow()

    const defaultStyle = {
        overflow: 'hidden',
        height: '2em',
        margin: '0',
        flex: '1 1 8em',
    }

    let playersNames = ''
    players.forEach((p, i) => {
        if (i !== 0 && players.length / i === 2) {
            playersNames += '\t----- vs -----\t\n'
        }
        playersNames += profiles[p.profile_id].alias + '\n'
    })

    return (
        <>
            <div
                title={playersNames}
                style={{
                    ...defaultStyle,
                    border: '.1em solid ' + backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    cursor: 'pointer',
                    margin: '0.2em',
                }}
                onClick={() => {
                    setModal(true)
                }}
            >
                <img
                    style={{
                        width: '1.4em',
                        height: '1.4em',
                    }}
                    src={getFactionFlagLocation(
                        getFactionById(game.result.race_id),
                    )}
                    alt={`${getFactionById(game.result.race_id)}`}
                />

                <div
                    style={{
                        fontSize: '70%',
                        width: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <div>{matchType}</div>
                    <div>{timeAgo}</div>
                </div>
            </div>

            <ModalDiv
                modal={modal}
                setModal={setModal}
                game={game}
                settings={settings}
                players={players}
                profiles={profiles}
            />

        </>
    )
}
