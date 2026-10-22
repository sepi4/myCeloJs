import { CSSProperties, useState } from 'react'

import { getFactionCodeCoh2ById, getFactionCodeCoh3ById } from '../../constants/factionMappings'
import {
    getFactionFlagLocation,
    getFactionFlagLocationCoh3,
} from '../../functions/utils/getFactionFlagLocation'
import { getTimeAgo } from '../../functions/utils/time'
import { useSettingsStore } from '../../stores/settingsStore'
import { MatchHistoryReportResult, MatchObject, NormalizedProfiles } from '../../types'
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

    let resultColor = 'var(--accent-neutral)'
    if (props.game.result.resulttype === 1) {
        resultColor = 'var(--accent-positive)'
    }
    if (props.game.result.resulttype === 0) {
        resultColor = 'var(--accent-negative)'
    }

    const players = props.game.players.sort((a, b) => b.teamid - a.teamid)

    const rawName = props.game.matchType?.name ?? '???'
    const matchType = rawName.match(/^(\dv\d)/i)?.[1]?.toLowerCase() ?? rawName
    const timeAgo = getTimeAgo(props.game.endGameTime, lg, true)

    const result = props.game.result
    const getFlag = (raceId: number) => {
        const code = props.coh3 ? getFactionCodeCoh3ById(raceId) : getFactionCodeCoh2ById(raceId)
        const flag = props.coh3 ? getFactionFlagLocationCoh3(code) : getFactionFlagLocation(code)
        return { code, flag }
    }

    // own player first, then teammates
    const isMe = (p: MatchHistoryReportResult) => p.profile_id === result.profile_id
    const allies = players
        .filter(isMe)
        .concat(players.filter((p) => p.teamid === result.teamid && !isMe(p)))
    const opponents = players.filter((p) => p.teamid !== result.teamid)

    const renderTeam = (team: MatchHistoryReportResult[], className = '') => (
        <div className={`${styles.team} ${className}`}>
            {team.map((p) => {
                const { code, flag } = getFlag(p.race_id)
                const name = props.profiles[p.profile_id]?.alias ?? `${p.profile_id}`
                return (
                    <span
                        key={p.profile_id}
                        className={isMe(p) ? `${styles.player} ${styles.me}` : styles.player}
                        title={name}
                    >
                        <img src={flag} alt={code} />
                        <span>{name}</span>
                    </span>
                )
            })}
        </div>
    )

    return (
        <>
            <div
                data-testid="game-history-item"
                className={styles.container}
                style={{ '--result-color': resultColor } as CSSProperties}
                onClick={() => setModal(true)}
            >
                <div className={styles.mode}>{matchType}</div>
                {renderTeam(allies, styles.allies)}
                <div className={styles.vs}>vs</div>
                {renderTeam(opponents)}
                <div className={styles.time}>{timeAgo}</div>
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
