import { CSSProperties, MouseEvent } from 'react'

import { getFactionCodeByRaceId, getFactionFlag } from '../../constants/games'
import { getTimeAgo } from '../../functions/utils/time'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useLanguage from '../../hooks/useLanguage'
import useOpenPlayerCard from '../../hooks/useOpenPlayerCard'
import { MatchHistoryReportResult, MatchObject, NormalizedProfiles } from '../../types'
import { faCaretDown, faCaretRight } from '../icons'
import PlayerName from '../PlayerName'
import SvgIcon from '../SvgIcon'
import GameDetails from './GameDetails'

import styles from './GameHistoryRow.module.css'

interface Props {
    game: MatchObject
    profiles: NormalizedProfiles
    open: boolean
    onToggle: () => void
}

export default function GameHistoryRow(props: Props) {
    const displayGame = useDisplayGame()
    const language = useLanguage()
    const openPlayerCard = useOpenPlayerCard()

    if (!props.game.result) {
        return null
    }

    let resultColor = 'var(--accent-neutral)'
    if (props.game.result.resulttype === 1) {
        resultColor = 'var(--accent-positive)'
    }
    if (props.game.result.resulttype === 0) {
        resultColor = 'var(--accent-negative)'
    }

    const players = props.game.players.toSorted((a, b) => b.teamid - a.teamid)

    const rawName = props.game.matchType?.name ?? '???'
    const matchType = rawName.match(/^(\dv\d)/i)?.[1]?.toLowerCase() ?? rawName
    const timeAgo = getTimeAgo(props.game.endGameTime, language, true)

    const result = props.game.result
    const getFlag = (raceId: number) => {
        const code = getFactionCodeByRaceId(displayGame, raceId)
        const flag = getFactionFlag(displayGame, code)
        return { code, flag }
    }

    // own player first, then teammates
    const isMe = (p: MatchHistoryReportResult) => p.profile_id === result.profile_id
    const allies = players
        .filter(isMe)
        .concat(players.filter((p) => p.teamid === result.teamid && !isMe(p)))
    const opponents = players.filter((p) => p.teamid !== result.teamid)

    const handleOpenPlayer = (e: MouseEvent, p: MatchHistoryReportResult, name: string) => {
        // the row itself toggles the game details
        e.stopPropagation()
        openPlayerCard({
            country: props.profiles[p.profile_id]?.country,
            name,
            profileId: p.profile_id,
        })
    }

    const renderTeam = (team: MatchHistoryReportResult[], className = '') => (
        <div className={`${styles.team} ${className}`}>
            {team.map((p) => {
                const { code, flag } = getFlag(p.race_id)
                const name = props.profiles[p.profile_id]?.alias ?? `${p.profile_id}`
                return (
                    <span
                        key={p.profile_id}
                        className={isMe(p) ? `${styles.player} ${styles.me}` : styles.player}
                    >
                        <img src={flag} alt={code} />
                        <button
                            type="button"
                            data-testid="game-history-player"
                            className={styles.name}
                            title={name}
                            onClick={(e) => handleOpenPlayer(e, p, name)}
                        >
                            <PlayerName name={name} />
                        </button>
                    </span>
                )
            })}
        </div>
    )

    return (
        <div className={props.open ? `${styles.entry} ${styles.entryOpen}` : styles.entry}>
            <div
                data-testid="game-history-row"
                className={styles.container}
                style={{ '--result-color': resultColor } as CSSProperties}
                onClick={props.onToggle}
            >
                <div className={styles.mode}>
                    <SvgIcon
                        className={styles.caret}
                        icon={props.open ? faCaretDown : faCaretRight}
                    />
                    {matchType}
                </div>
                {renderTeam(allies, styles.allies)}
                <div className={styles.vs}>vs</div>
                {renderTeam(opponents)}
                <div className={styles.time}>{timeAgo}</div>
            </div>
            {props.open && (
                <GameDetails
                    game={props.game}
                    // same order as the row: own team first, then opponents
                    players={allies.concat(opponents)}
                    profiles={props.profiles}
                />
            )}
        </div>
    )
}
