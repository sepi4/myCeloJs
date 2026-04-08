import { useState } from 'react'

import { getFactionCodeCoh2ById, getFactionCodeCoh3ById } from '../../constants/factionMappings'
import {
    getFactionFlagLocation,
    getFactionFlagLocationCoh3,
} from '../../functions/utils/getFactionFlagLocation'
import { getTimeAgo } from '../../functions/utils/time'
import { useSettingsStore } from '../../stores/settingsStore'
import { MatchObject, NormalizedProfiles } from '../../types'
import styles from './GameHistoryDiv.module.css'
import ModalDiv from './ModalDiv'

interface Props {
    game: MatchObject
    profiles: NormalizedProfiles
    coh3: boolean
}

export default function GameHistoryDiv(props: Props) {
    const [modal, setModal] = useState(false)
    const { settings } = useSettingsStore()
    const lg = settings && settings.language ? settings.language : 'en'

    if (!props.game.result) {
        console.log('if return null')
        return null
    }

    let backgroundColor = 'var(--accent-neutral)'
    if (props.game.result.resulttype === 1) {
        backgroundColor = 'var(--accent-positive)'
    }
    if (props.game.result.resulttype === 0) {
        backgroundColor = 'var(--accent-negative)'
    }

    const players = props.game.players.sort((a, b) => b.teamid - a.teamid)

    const matchType = props.game.matchType ? props.game.matchType.name : '???'
    const timeAgo = getTimeAgo(props.game.endGameTime, lg)

    let playersNames = ''
    players.forEach((p, i) => {
        if (i !== 0 && players.length / i === 2) {
            playersNames += '\t----- vs -----\t\n'
        }
        const profile = props.profiles[p.profile_id]
        playersNames += (profile ? profile.alias : `${p.profile_id}`) + '\n'
    })

    const factionCode = props.coh3
        ? getFactionCodeCoh3ById(props.game.result.race_id)
        : getFactionCodeCoh2ById(props.game.result.race_id)
    const factionFlag = props.coh3
        ? getFactionFlagLocationCoh3(factionCode)
        : getFactionFlagLocation(factionCode)

    return (
        <>
            <div
                data-testid="game-history-item"
                title={playersNames}
                className={styles.container}
                style={{ border: '.1em solid ' + backgroundColor }}
                onClick={() => setModal(true)}
            >
                <img src={factionFlag} alt={factionCode} />

                <div className={styles.name}>
                    <div>{matchType}</div>
                    <div>{timeAgo}</div>
                </div>
            </div>

            <ModalDiv
                game={props.game}
                modal={modal}
                players={players}
                profiles={props.profiles}
                setModal={setModal}
                settings={settings!}
            />
        </>
    )
}
