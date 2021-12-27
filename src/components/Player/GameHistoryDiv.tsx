import React, { useState } from 'react'

import ModalDiv from './ModalDiv'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'
import { getTimeAgo } from '../../functions/time'

import styles from './GameHistoryDiv.module.css'
import { MatchObject, NormalizedProfiles } from '../../types'
import { useAppSelector } from '../../hooks/customReduxHooks'

interface Props {
    game: MatchObject
    profiles: NormalizedProfiles
}

export default function GameHistoryDiv(props: Props) {
    const [modal, setModal] = useState(false)
    const settings = useAppSelector((state) => state.settings)
    const lg = settings && settings.language ? settings.language : 'en'

    if (!props.game.result) {
        return null
    }

    let backgroundColor = 'blue'
    if (props.game.result.resulttype === 1) {
        backgroundColor = 'green'
    }
    if (props.game.result.resulttype === 0) {
        backgroundColor = 'red'
    }

    const players = props.game.players.sort((a, b) => b.teamid - a.teamid)

    const matchType = props.game.matchType ? props.game.matchType.name : '???'
    const timeAgo = getTimeAgo(props.game.endGameTime, lg)

    let playersNames = ''
    players.forEach((p, i) => {
        if (i !== 0 && players.length / i === 2) {
            playersNames += '\t----- vs -----\t\n'
        }
        playersNames += props.profiles[p.profile_id].alias + '\n'
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
                    src={getFactionFlagLocation(
                        getFactionById(props.game.result.race_id)
                    )}
                    alt={`${getFactionById(props.game.result.race_id)}`}
                />

                <div className={styles.name}>
                    <div>{matchType}</div>
                    <div>{timeAgo}</div>
                </div>
            </div>

            <ModalDiv
                modal={modal}
                setModal={setModal}
                game={props.game}
                settings={settings}
                players={players}
                profiles={props.profiles}
            />
        </>
    )
}
