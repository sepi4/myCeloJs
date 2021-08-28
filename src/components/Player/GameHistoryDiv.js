import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import ModalDiv from './ModalDiv'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'
import { getTimeAgo } from '../../functions/time'

import styles from './GameHistoryDiv.module.css'

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
    const timeAgo = getTimeAgo(game.endGameTime, lg)

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
                className={styles.container}
                style={{ border: '.1em solid ' + backgroundColor }}
                onClick={() => setModal(true)}
            >
                <img
                    src={
                        getFactionFlagLocation(
                            getFactionById(game.result.race_id),
                        )
                    }
                    alt={`${getFactionById(game.result.race_id)}`}
                />

                <div className={styles.name} >
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
